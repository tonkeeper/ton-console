import { makeAutoObservable } from 'mobx';
import { Loadable, TonCurrencyAmount } from 'src/shared';
import { AnalyticsQuery, AnalyticsQueryTemplate } from './interfaces';

const wait = (to: number): Promise<void> => new Promise(r => setTimeout(r, to));

class AnalyticsQueryStore {
    template$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    query$ = new Loadable<AnalyticsQuery | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    estimateRequest = this.template$.createAsyncAction(async (request: string) => {
        await wait(1000);
        return {
            request,
            estimatedTimeMS: 360_000,
            estimatedCost: new TonCurrencyAmount(3000000000)
        };
    });
}

export const analyticsQueryStore = new AnalyticsQueryStore();
