import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createReaction,
    DTOChain,
    DTOStatsQueryResult,
    DTOStatsQueryStatus,
    Loadable,
    Network,
    TonCurrencyAmount
} from 'src/shared';
import {
    AnalyticsChart,
    AnalyticsChartOptions,
    AnalyticsQuery,
    AnalyticsTableSource,
    AnalyticsTablesSchema,
    isAnalyticsQuerySuccessful
} from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { AnalyticsGPTGenerationStore } from './analytics-gpt-generation.store';
import { parse } from 'csv-parse/sync';

export class AnalyticsQueryStore {
    query$ = new Loadable<AnalyticsQuery | null>(null);

    chartsDatasource$ = new Loadable<Record<string, number>[] | null>(null);

    tablesSchema$ = new Loadable<AnalyticsTablesSchema | undefined>(undefined);

    private analyticsGPTGenerationStore: AnalyticsGPTGenerationStore;

    private disposers: Array<() => void> = [];

    get isQueryIntervalUpdateLoading(): boolean {
        return this.setRepeatOnQuery.isLoading || this.removeRepeatOnQuery.isLoading;
    }

    constructor(analyticsGPTGenerationStore: AnalyticsGPTGenerationStore) {
        this.analyticsGPTGenerationStore = analyticsGPTGenerationStore;
        makeAutoObservable(this);

        const dispose1 = createReaction(
            () => projectsStore.selectedProject?.id,
            (_, prevId) => {
                if (prevId) {
                    this.clear();
                }
            }
        );
        this.disposers.push(dispose1);

        const dispose2 = createReaction(
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
        this.disposers.push(dispose2);
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
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

    addChart = this.query$.createAsyncAction(async (chart: AnalyticsChartOptions) => {
        if (!isAnalyticsQuerySuccessful(this.query$.value!)) {
            return;
        }

        if (this.query$.value.charts.some(c => c.type === chart.type)) {
            throw new Error(`Chart ${chart.type} already exists`);
        }

        this.query$.value.charts.push(chart);
    });

    removeChart = this.query$.createAsyncAction(async (chartType: AnalyticsChart) => {
        if (!isAnalyticsQuerySuccessful(this.query$.value!)) {
            return;
        }

        this.query$.value.charts = this.query$.value.charts.filter(c => c.type !== chartType);
    });

    createQuery = this.query$.createAsyncAction(
        async (query: string, network: 'mainnet' | 'testnet') => {
            const result = await apiClient.api.sendQueryToStats(
                {
                    project_id: projectsStore.selectedProject!.id,
                    query,
                    ...(query.trim() ===
                        this.analyticsGPTGenerationStore.generatedSQL$.value?.trim() && {
                        gpt_message: this.analyticsGPTGenerationStore.gptPrompt
                    })
                },
                {
                    chain: network === 'testnet' ? DTOChain.DTOTestnet : DTOChain.DTOMainnet
                }
            );

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

    setNameForQuery = this.query$.createAsyncAction(
        async (name: string) => {
            await apiClient.api.updateStatsQuery(
                this.query$.value!.id,
                {
                    project_id: projectsStore.selectedProject!.id
                },
                { name }
            );

            this.query$.value!.name = name;
        },
        {
            successToast: {
                title: 'Query name updated successfully',
                status: 'success',
                isClosable: true
            },
            errorToast: e => ({
                title: 'Query name update error',
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
        async (queryId: string) => {
            const result = await apiClient.api.getSqlResultFromStats(queryId);
            return mapDTOStatsSqlResultToAnalyticsQuery(result.data);
        },
        { resetBeforeExecution: true }
    );

    updateChartDatasource = this.chartsDatasource$.createAsyncAction(async () => {
        if (!isAnalyticsQuerySuccessful(this.query$.value!)) {
            return;
        }

        return downloadAndParseCSV(this.query$.value.csvUrl);
    });

    clear(): void {
        this.query$.clear();
        this.chartsDatasource$.clear();
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
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        estimatedCost: new TonCurrencyAmount(value.estimate!.approximate_cost),
        explanation: value.estimate!.explain!,
        name: value.name,
        ...(value.query?.repeat_interval && {
            repeatFrequencyMs: value.query?.repeat_interval * 1000
        }),
        network: value.testnet ? Network.TESTNET : Network.MAINNET
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
            // TODO: PRICES remove this after backend will be updated
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cost: new TonCurrencyAmount(value.cost!),
            spentTimeMS: value.spent_time!,
            csvUrl: value.url!,
            preview: parsePreview(value.preview!, !!value.all_data_in_preview),
            charts: [] // TODO
        };
    }

    return {
        ...basicQuery,
        status: 'error',
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cost: new TonCurrencyAmount(value.cost!),
        spentTimeMS: value.spent_time!,
        errorReason: value.error!
    };
}

function isStrictDecimal(value: string): boolean {
    const decimalPattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
    return decimalPattern.test(value.trim());
}

async function downloadAndParseCSV(url: string): Promise<Record<string, number>[]> {
    const preFetched = await fetch(url);
    // console.log(preFetched.headers.get('content-length')); // TODO check content-length

    const result = await preFetched.text();

    const numericFields = new Map<string | number, boolean>();
    const parsed: Record<string, string | number>[] = parse(result, {
        columns: true,
        skip_empty_lines: true,
        cast(value, ctx) {
            if (isStrictDecimal(value)) {
                if (!numericFields.has(ctx.column)) {
                    numericFields.set(ctx.column, true);
                }
                return parseFloat(value);
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
