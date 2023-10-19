import { makeAutoObservable } from 'mobx';
import { apiClient, Loadable, TonCurrencyAmount } from 'src/shared';
import { AnalyticsQuery, AnalyticsQueryTemplate } from './interfaces';
import { projectsStore } from 'src/entities';
import { fetchCSV } from './csv-utils';

class AnalyticsQueryStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    query$ = new Loadable<AnalyticsQuery | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    estimateRequest = (request: string): Promise<unknown> =>
        this._estimateRequest(request, { cancelAllPreviousCalls: true });

    private _estimateRequest = this.request$.createAsyncAction(async (request: string) => {
        await apiClient.api.sendSqlToStats({
            project_id: projectsStore.selectedProject!.id,
            query: 'select id from blockchain.account_code'
        });
        return {
            request,
            estimatedTimeMS: 360_000,
            estimatedCost: new TonCurrencyAmount(3000000000)
        };
    });

    createQuery = this.query$.createAsyncAction(async () => {
        return {
            ...this.request$.value,
            id: Math.random().toString(),
            status: 'executing',
            creationDate: new Date()
        };
    });

    fetchQuery = this.query$.createAsyncAction(async () => {
        const preview = await fetchCSV(
            'https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/customers/customers-100.csv'
        );

        return {
            ...this.query$.value,
            status: 'success',
            csvUrl: 'https://example.com',
            preview
        };
    });

    clearRequest = (): void => {
        this._estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    };
}

export const analyticsQueryStore = new AnalyticsQueryStore();
