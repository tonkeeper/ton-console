import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    DTOStatsEstimateSQL,
    DTOStatsSqlResult,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import { AnalyticsQuery, AnalyticsQueryTemplate } from './interfaces';
import { projectsStore } from 'src/entities';
import { fetchCSV } from './csv-utils';

class AnalyticsQueryStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    query$ = new Loadable<AnalyticsQuery | null>(null);

    get requestEqQuery(): boolean {
        return this.request$.value?.request === this.query$.value?.request;
    }

    constructor() {
        makeAutoObservable(this);
    }

    public estimateRequest = this.request$.createAsyncAction(async (request: string) => {
        try {
            const result = await apiClient.api.estimateStatsSqlQuery({
                project_id: projectsStore.selectedProject!.id,
                query: request
            });

            return mapDTOStatsEstimateSQLToAnalyticsQuery(request, result.data);
        } catch (e) {
            const errText =
                (
                    e as { response: { data: { error: string } } }
                )?.response?.data?.error?.toString() || 'Unknown error';

            throw new Error(errText);
        }
    });

    createQuery = this.query$.createAsyncAction(async () => {
        await apiClient.api.sendSqlToStats({
            project_id: projectsStore.selectedProject!.id,
            query: this.request$.value!.request
        });

        return {
            ...this.request$.value,
            id: Math.random().toString(),
            status: 'executing',
            creationDate: new Date()
        };
    });

    refetchQuery = this.query$.createAsyncAction(async () => {
        const preview = await fetchCSV(
            'https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/customers/customers-100.csv'
        );

        return {
            ...this.query$.value,
            status: 'success',
            csvUrl: 'https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/customers/customers-100.csv',
            preview
        };
    });

    loadQueryAndRequest = createAsyncAction(async (id: string) => {
        this.clearRequest();
        this.query$.clear();

        this.request$.setStartLoading();
        this.query$.setStartLoading();

        this.request$.setValue({
            estimatedTimeMS: 10000,
            estimatedCost: new TonCurrencyAmount(3000000000),
            request: 'SELECT 1234'
        });

        this.query$.setValue({
            id: id,
            creationDate: new Date(),
            status: 'success',
            estimatedTimeMS: 10000,
            estimatedCost: new TonCurrencyAmount(3000000000),
            request: 'SELECT 1234',
            cost: new TonCurrencyAmount(3000000000),
            spentTimeMS: 10000,
            csvUrl: 'https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/customers/customers-100.csv',
            preview: {
                data: [
                    ['Vincent', '12'],
                    ['peter', '15'],
                    ['pudge', '2023']
                ],
                headings: ['name', 'age']
            }
        });

        this.request$.setEndLoading();
        this.query$.setEndLoading();
    });

    clearRequest = (): void => {
        this.estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    };

    clear(): void {
        this.request$.clear();
        this.query$.clear();
    }
}

function mapDTOStatsEstimateSQLToAnalyticsQuery(
    request: string,
    value: DTOStatsEstimateSQL
): AnalyticsQueryTemplate {
    return {
        request,
        estimatedTimeMS: Math.ceil(value.approximate_time * 1000),
        estimatedCost: new TonCurrencyAmount(value.approximate_cost)
    };
}

export function mapDTOStatsSqlResultToAnalyticsQuery(value: DTOStatsSqlResult): AnalyticsQuery {
    const rnd = Math.random();
    if (rnd > 0.67) {
        return {
            id: value.id,
            creationDate: new Date(),
            status: 'executing',
            estimatedTimeMS: 10000,
            estimatedCost: new TonCurrencyAmount(3000000000),
            request: 'SELECT 123'
        };
    } else if (rnd > 0.33) {
        return {
            id: value.id,
            creationDate: new Date(),
            status: 'success',
            estimatedTimeMS: 10000,
            estimatedCost: new TonCurrencyAmount(3000000000),
            request: 'SELECT 123',
            cost: new TonCurrencyAmount(3000000000),
            spentTimeMS: 10000,
            csvUrl: 'https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/customers/customers-100.csv',
            preview: {
                data: [
                    ['Vincent', '12'],
                    ['peter', '15'],
                    ['pudge', '2023']
                ],
                headings: ['name', 'age']
            }
        };
    } else {
        return {
            id: value.id,
            creationDate: new Date(),
            status: 'error',
            estimatedTimeMS: 10000,
            estimatedCost: new TonCurrencyAmount(3000000000),
            request: 'SELECT 123',
            cost: new TonCurrencyAmount(3000000000),
            spentTimeMS: 10000,
            errorReason: 'Cannot fetch data'
        };
    }
}

export const analyticsQueryStore = new AnalyticsQueryStore();
