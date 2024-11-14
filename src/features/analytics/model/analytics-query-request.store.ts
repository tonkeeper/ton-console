import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createReaction,
    DTOChain,
    DTOStatsEstimateQuery,
    Loadable,
    Network,
    TonCurrencyAmount
} from 'src/shared';
import { AnalyticsQueryTemplate } from './interfaces';
import { projectsStore } from 'src/entities';
import { DTOChainNetworkMap } from 'src/shared/lib/blockchain/network';

class AnalyticsQueryRequestStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    private _network = Network.MAINNET;

    get network(): Network {
        return this._network;
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
                        ? DTOChain.DTOTestnet
                        : DTOChain.DTOMainnet;

                const result = await apiClient.api.estimateStatsQuery(
                    {
                        project_id: projectsStore.selectedProject!.id,
                        query: request,
                        name
                    },
                    { chain }
                );

                const analyticsQuery = mapDTOStatsEstimateSQLToAnalyticsQuery(
                    request,
                    chain,
                    result.data
                );

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
        estimatedCost: new TonCurrencyAmount(value.approximate_cost),
        explanation: value.explain!
    };
}

export const analyticsQuerySQLRequestStore = new AnalyticsQueryRequestStore();
export const analyticsQueryGPTRequestStore = new AnalyticsQueryRequestStore();
