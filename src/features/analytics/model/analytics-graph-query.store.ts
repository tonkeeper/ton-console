import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    DTOStatsQueryResult,
    DTOStatsQueryStatus,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import { AnalyticsGraphQuery, AnalyticsGraphQueryBasic } from './interfaces';
import { projectsStore } from 'src/entities';

class AnalyticsGraphQueryStore {
    query$ = new Loadable<AnalyticsGraphQuery | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    createQuery = this.query$.createAsyncAction(
        async (form: { addresses: string[]; isBetweenSelectedOnly: boolean }) => {
            const result = await apiClient.api.getGraphFromStats({
                project_id: projectsStore.selectedProject!.id,
                addresses: form.addresses.join(','),
                only_between: form.isBetweenSelectedOnly
            });

            return mapDTOStatsGraphResultToAnalyticsGraphQuery(result.data);
        }
    );

    refetchQuery = this.query$.createAsyncAction(async () => {
        const result = await apiClient.api.getSqlResultFromStats(this.query$.value!.id);

        return mapDTOStatsGraphResultToAnalyticsGraphQuery(result.data);
    });

    loadQuery = this.query$.createAsyncAction(async id => {
        const result = await apiClient.api.getSqlResultFromStats(id);

        return mapDTOStatsGraphResultToAnalyticsGraphQuery(result.data);
    });

    clear(): void {
        this.query$.clear();
    }
}

export function mapDTOStatsGraphResultToAnalyticsGraphQuery(
    value: DTOStatsQueryResult
): AnalyticsGraphQuery {
    const basicQuery: AnalyticsGraphQueryBasic = {
        id: value.id,
        type: 'graph',
        addresses: value.query!.addresses!,
        creationDate: new Date(value.date_create),
        isBetweenSelectedOnly: value.query!.only_between!
    };

    if (value.status === DTOStatsQueryStatus.DTOSuccess) {
        return {
            ...basicQuery,
            status: 'success',
            resultUrl: value.meta_url!,
            spentTimeMS: value.spent_time!,
            cost: new TonCurrencyAmount(value.cost!)
        };
    }

    if (value.status === DTOStatsQueryStatus.DTOExecuting) {
        return {
            ...basicQuery,
            status: 'executing'
        };
    }

    return {
        ...basicQuery,
        status: 'error',
        errorReason: value.error!,
        spentTimeMS: value.spent_time!,
        cost: new TonCurrencyAmount(value.cost!)
    };
}

export const analyticsGraphQueryStore = new AnalyticsGraphQueryStore();
