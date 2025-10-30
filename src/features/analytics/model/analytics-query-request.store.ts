import { makeAutoObservable } from 'mobx';
import { createReaction, Loadable, Network, TonCurrencyAmount } from 'src/shared';
import { estimateStatsQuery, DTOChain, DTOStatsEstimateQuery } from 'src/shared/api';
import { AnalyticsQueryTemplate } from './interfaces';
import { DTOChainNetworkMap } from 'src/shared/lib/blockchain/network';
import { Project } from 'src/entities';

export class AnalyticsQueryRequestStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    private _network = Network.MAINNET;

    private disposers: Array<() => void> = [];

    get network(): Network {
        return this._network;
    }

    constructor(private readonly project: Project) {
        makeAutoObservable(this);

        const dispose = createReaction(
            () => this.project,
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

    public estimateRequest = this.request$.createAsyncAction(
        async ({
            request,
            name,
            network
        }: {
            request: string;
            name?: string;
            network?: Network;
        }) => {
            try {
                const chain =
                    (network || this.network) === Network.TESTNET
                        ? DTOChain.TESTNET
                        : DTOChain.MAINNET;

                const { data, error } = await estimateStatsQuery({
                    body: {
                        project_id: this.project.id,
                        query: request,
                        name
                    },
                    query: { chain }
                });

                if (error) throw error;

                const analyticsQuery = mapDTOStatsEstimateSQLToAnalyticsQuery(request, chain, data);

                this.request$.value = analyticsQuery;
                return analyticsQuery;
            } catch (e) {
                const errText =
                    (
                        e as { response: { data: { error: string } } }
                    )?.response?.data?.error?.toString() || 'Unknown error';

                throw new Error(errText);
            }
        }
    );

    public setNetwork = this.request$.createAsyncAction(async (network: Network) => {
        this.estimateRequest.cancelAllPendingCalls();
        this._network = network;
        if (this.request$.value && this.request$.value.network !== network) {
            await this.estimateRequest({
                request: this.request$.value.request,
                network
            });
        }
    });

    setRequest = (template: AnalyticsQueryTemplate) => {
        this.request$.clear(template);
        this._network = template.network;
        this.request$.state = 'ready';
    };

    clear(): void {
        this.estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    }

    clearRequest(): void {
        this.estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    }
}

function mapDTOStatsEstimateSQLToAnalyticsQuery(
    request: string,
    network: DTOChain,
    value: DTOStatsEstimateQuery
): AnalyticsQueryTemplate {
    return {
        request,
        network: DTOChainNetworkMap[network],
        estimatedTimeMS: value.approximate_time,
        // TODO: PRICES remove this after backend will be updated
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        estimatedCost: new TonCurrencyAmount(value.approximate_cost),
        explanation: value.explain!
    };
}
