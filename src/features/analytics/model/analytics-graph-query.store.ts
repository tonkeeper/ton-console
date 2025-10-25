import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createReaction,
    DTOStatsQueryResult,
    DTOStatsQueryStatus,
    Loadable,
    TonAddress,
    TonCurrencyAmount
} from 'src/shared';
import { AnalyticsGraphQuery, AnalyticsGraphQueryBasic } from './interfaces';
import { projectsStore } from 'src/shared/stores';

export class AnalyticsGraphQueryStore {
    query$ = new Loadable<AnalyticsGraphQuery | null>(null);

    private disposers: Array<() => void> = [];

    constructor() {
        makeAutoObservable(this);

        const dispose = createReaction(
            () => projectsStore.selectedProject?.id,
            (_, prevId) => {
                if (prevId) {
                    this.clear();
                }
            }
        );
        this.disposers.push(dispose);
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }

    createQuery = this.query$.createAsyncAction(
        async (form: { addresses: string[]; isBetweenSelectedOnly: boolean }) => {
            const result = await apiClient.api.getGraphFromStats({
                project_id: projectsStore.selectedProject!.id,
                addresses: form.addresses.join(','),
                only_between: form.isBetweenSelectedOnly
            });

            return mapDTOStatsGraphResultToAnalyticsGraphQuery(result.data);
        },
        {
            onError: () => {
                this.query$.clear();
            },
            errorToast: e => ({
                title: 'Error',
                description: (e as { response: { data: { error: string } } }).response.data.error
            })
        }
    );

    refetchQuery = this.query$.createAsyncAction(async () => {
        const result = await apiClient.api.getSqlResultFromStats(this.query$.value!.id);

        return mapDTOStatsGraphResultToAnalyticsGraphQuery(result.data);
    });

    loadQuery = this.query$.createAsyncAction(async id => {
        const result = await apiClient.api.getSqlResultFromStats(id);

        this.refetchQuery.cancelAllPendingCalls();
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
        addresses: value.query!.addresses!.map(a => TonAddress.parse(a)),
        creationDate: new Date(value.date_create),
        isBetweenSelectedOnly: value.query!.only_between!
    };

    if (value.status === DTOStatsQueryStatus.DTOSuccess) {
        return {
            ...basicQuery,
            status: 'success',
            resultUrl: `https://cosmograph.app/run/?nodeColor=color-node_color&nodeSize=size-node_value&data=${encodeURIComponent(
                value.url!
            )}&meta=${encodeURIComponent(value.meta_url!)}`,
            spentTimeMS: value.spent_time!,
            // TODO: PRICES remove this after backend will be updated
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cost: new TonCurrencyAmount(value.cost!)
    };
}
