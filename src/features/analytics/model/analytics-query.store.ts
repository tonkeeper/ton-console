import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createReaction,
    DTOStatsQueryResult,
    DTOStatsQueryStatus,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import {
    AnalyticsQuery,
    AnalyticsQuerySuccessful,
    AnalyticsTableSource,
    AnalyticsTablesSchema
} from './interfaces';
import { projectsStore } from 'src/entities';
import { analyticsGPTGenerationStore, analyticsHistoryTableStore } from 'src/features';
import { parse } from 'csv-parse/sync';

class AnalyticsQueryStore {
    query$ = new Loadable<AnalyticsQuery | null>(null);

    chartsDatasource$ = new Loadable<Record<string, number>[] | null>(null);

    tablesSchema$ = new Loadable<AnalyticsTablesSchema | undefined>(undefined);

    get isQueryIntervalUpdateLoading(): boolean {
        return this.setRepeatOnQuery.isLoading || this.removeRepeatOnQuery.isLoading;
    }

    constructor() {
        makeAutoObservable(this);

        createReaction(
            () => projectsStore.selectedProject?.id,
            (_, prevId) => {
                if (prevId) {
                    this.clear();
                }
            }
        );

        createReaction(
            () =>
                (this.query$.value?.id || '').toString() +
                (this.query$.value?.status || '').toString(),
            () => {
                this.updateChartDatasource.cancelAllPendingCalls();

                if (this.query$.value?.status === 'success') {
                    this.updateChartDatasource();
                } else {
                    this.chartsDatasource$.setValue(null);
                }
            }
        );
    }

    public fetchAllTablesSchema = this.tablesSchema$.createAsyncAction(
        async () => {
            if (!this.tablesSchema$.value) {
                const result = await apiClient.api.getStatsDdl();
                return parseDDL(result.data as unknown as string);
            }
        },
        { resetBeforeExecution: true }
    );

    createQuery = this.query$.createAsyncAction(
        async (query: string) => {
            const result = await apiClient.api.sendQueryToStats({
                project_id: projectsStore.selectedProject!.id,
                query,
                ...(query.trim() === analyticsGPTGenerationStore.generatedSQL$.value?.trim() && {
                    gpt_message: analyticsGPTGenerationStore.gptPrompt
                })
            });

            await analyticsHistoryTableStore.fetchPaymentsHistory();

            return mapDTOStatsSqlResultToAnalyticsQuery(result.data);
        },
        {
            errorToast: e => ({
                title: 'Error',
                description: (e as { response: { data: { error: string } } }).response.data.error
            })
        }
    );

    setRepeatOnQuery = this.query$.createAsyncAction(
        async (repeatIntervalS: number) => {
            const result = await apiClient.api.updateStatsQuery(
                this.query$.value!.id,
                {
                    project_id: projectsStore.selectedProject!.id
                },
                { repeat_interval: repeatIntervalS }
            );
            this.query$.value!.repeatFrequencyMs = result.data.repeat_interval! * 1000;
        },
        {
            successToast: {
                title: 'Query repeat interval updated successfully',
                status: 'success',
                isClosable: true
            },
            errorToast: e => ({
                title: 'Query repeat interval update error',
                description:
                    (e as { response: { data: { error: string } } }).response?.data?.error ||
                    'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            })
        }
    );

    removeRepeatOnQuery = this.query$.createAsyncAction(
        async () => {
            await apiClient.api.updateStatsQuery(
                this.query$.value!.id,
                {
                    project_id: projectsStore.selectedProject!.id
                },
                { repeat_interval: 0 }
            );

            delete this.query$.value!.repeatFrequencyMs;
        },
        {
            successToast: {
                title: 'Query repeating stopped successfully',
                status: 'success',
                isClosable: true
            },
            errorToast: e => ({
                title: 'Query repeat interval update error',
                description:
                    (e as { response: { data: { error: string } } }).response?.data?.error ||
                    'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            })
        }
    );

    refetchQuery = this.query$.createAsyncAction(async () => {
        const result = await apiClient.api.getSqlResultFromStats(this.query$.value!.id);

        return mapDTOStatsSqlResultToAnalyticsQuery(result.data);
    });

    loadQuery = this.query$.createAsyncAction(
        async (id: string) => {
            const result = await apiClient.api.getSqlResultFromStats(id);
            return mapDTOStatsSqlResultToAnalyticsQuery(result.data);
        },
        { resetBeforeExecution: true }
    );

    updateChartDatasource = this.chartsDatasource$.createAsyncAction(() => {
        const query = this.query$.value! as AnalyticsQuerySuccessful;
        return downloadAndParseCSV(query.csvUrl);
    });

    clear(): void {
        this.query$.clear();
    }
}

export function mapDTOStatsSqlResultToAnalyticsQuery(value: DTOStatsQueryResult): AnalyticsQuery {
    const basicQuery = {
        type: 'query',
        id: value.id,
        creationDate: new Date(value.date_create),
        gptPrompt: value.query?.gpt_message,
        request: value.query!.sql!,
        estimatedTimeMS: value.estimate!.approximate_time,
        estimatedCost: new TonCurrencyAmount(value.estimate!.approximate_cost),
        explanation: value.estimate!.explain!,
        ...(value.query?.repeat_interval && {
            repeatFrequencyMs: value.query?.repeat_interval * 1000
        })
    } as const;

    if (value.status === DTOStatsQueryStatus.DTOExecuting) {
        return {
            ...basicQuery,
            status: 'executing'
        };
    }

    if (value.status === DTOStatsQueryStatus.DTOSuccess) {
        return {
            ...basicQuery,
            status: 'success',
            cost: new TonCurrencyAmount(value.cost!),
            spentTimeMS: value.spent_time!,
            csvUrl: value.url!,
            preview: parsePreview(value.preview!, !!value.all_data_in_preview)
        };
    }

    return {
        ...basicQuery,
        status: 'error',
        cost: new TonCurrencyAmount(value.cost!),
        spentTimeMS: value.spent_time!,
        errorReason: value.error!
    };
}

async function downloadAndParseCSV(url: string): Promise<Record<string, number>[]> {
    const preFetched = await fetch(url);
    console.log(preFetched.headers.get('content-length')); // TODO check content-length

    const result = await preFetched.text();

    const numericFields = new Map<string | number, boolean>();
    const parsed: Record<string, string | number>[] = parse(result, {
        columns: true,
        skip_empty_lines: true,
        cast(value, ctx) {
            const parsedValue = parseFloat(value);
            if (isFinite(parsedValue)) {
                if (!numericFields.has(ctx.column)) {
                    numericFields.set(ctx.column, true);
                }
                numericFields.get(ctx.column);
                return parsedValue;
            }

            numericFields.set(ctx.column, false);

            return value;
        }
    });

    const numericColumnsList = Array.from(numericFields.entries())
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

    return parsed.map(row =>
        Object.fromEntries(numericColumnsList.map(key => [key, row[key]]))
    ) as Record<string, number>[];
}

function parsePreview(value: string[][], isAllDataPresented: boolean): AnalyticsTableSource {
    if (!value)
        return {
            headings: [],
            data: [],
            isAllDataPresented: true
        };

    const headings = value[0];
    const data = value.slice(1);
    return { headings, data, isAllDataPresented };
}

function parseDDL(ddl: string): AnalyticsTablesSchema {
    const tableRegex = /create table ([\w\.]+)\s*\(([\S\s]*?)\);/g;
    const propertiesRegex = /(\s*([a-zA-Z0-9_]+) [^,]*,)/g;

    const groups = Array.from(ddl.matchAll(tableRegex));

    return groups.reduce((acc, group) => {
        const name = group[1];
        const properties = (group[2] + ',').matchAll(propertiesRegex);
        acc[name] = Array.from(properties).map(match => match[2]);
        return acc;
    }, {} as AnalyticsTablesSchema);
}

export const analyticsQueryStore = new AnalyticsQueryStore();
