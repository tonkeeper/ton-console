import { makeAutoObservable } from 'mobx';
import {
    createReaction,
    Loadable,
    TonAddress,
    TonCurrencyAmount
} from 'src/shared';
import {
    getGraphFromStats,
    getSqlResultFromStats,
    DTOStatsQueryResult
} from 'src/shared/api';
import { AnalyticsGraphQuery, AnalyticsGraphQueryBasic } from './interfaces';
import { Project } from 'src/entities/project';

export class AnalyticsGraphQueryStore {
    query$ = new Loadable<AnalyticsGraphQuery | null>(null);

    private disposers: Array<() => void> = [];

    constructor(private readonly project: Project) {
        makeAutoObservable(this);

        const dispose = createReaction(
            () => project,
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
            const { data, error } = await getGraphFromStats({
                query: {
                    project_id: this.project.id,
                    addresses: form.addresses.join(','),
                    only_between: form.isBetweenSelectedOnly
                }
            });

            if (error) throw error;
            return mapDTOStatsGraphResultToAnalyticsGraphQuery(data);
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
        const { data, error } = await getSqlResultFromStats({
            path: { id: this.query$.value!.id }
        });

        if (error) throw error;
        return mapDTOStatsGraphResultToAnalyticsGraphQuery(data);
    });

    loadQuery = this.query$.createAsyncAction(async id => {
        const { data, error } = await getSqlResultFromStats({
            path: { id }
        });

        if (error) throw error;
        this.refetchQuery.cancelAllPendingCalls();
        return mapDTOStatsGraphResultToAnalyticsGraphQuery(data);
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

    if (value.status === 'success') {
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

    if (value.status === 'executing') {
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
