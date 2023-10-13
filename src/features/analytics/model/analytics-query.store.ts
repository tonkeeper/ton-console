import { makeAutoObservable } from 'mobx';
import { Loadable, TonCurrencyAmount } from 'src/shared';
import { AnalyticsQuery, AnalyticsQueryTemplate } from './interfaces';

const wait = (to: number): Promise<void> => new Promise(r => setTimeout(r, to));

class AnalyticsQueryStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    query$ = new Loadable<AnalyticsQuery | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    estimateRequest = (request: string): Promise<unknown> =>
        this._estimateRequest(request, { cancelAllPreviousCalls: true });

    private _estimateRequest = this.request$.createAsyncAction(async (request: string) => {
        await wait(1000);
        return {
            request,
            estimatedTimeMS: 360_000,
            estimatedCost: new TonCurrencyAmount(3000000000)
        };
    });

    clearRequest = (): void => {
        this._estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    };
}

export const analyticsQueryStore = new AnalyticsQueryStore();
