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

class AnalyticsQueryRequestStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

    private _network: Network = 'mainnet';

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
        async (request: string, network?: Network) => {
            try {
                const chain =
                    (network || this.network) === 'testnet'
                        ? DTOChain.DTOTestnet
                        : DTOChain.DTOMainnet;
                const result = await apiClient.api.estimateStatsQuery(
                    {
                        project_id: projectsStore.selectedProject!.id,
                        query: request
                    },
                    { chain }
                );

                return mapDTOStatsEstimateSQLToAnalyticsQuery(request, chain, result.data);
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
            await this.estimateRequest(this.request$.value.request, network);
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
        this._network = 'mainnet';
    }

    clearRequest(): void {
        this.estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    }
}

function mapDTOStatsEstimateSQLToAnalyticsQuery(
    request: string,
    network: Network,
    value: DTOStatsEstimateQuery
): AnalyticsQueryTemplate {
    return {
        request,
        network,
        estimatedTimeMS: value.approximate_time,
        estimatedCost: new TonCurrencyAmount(value.approximate_cost),
        explanation: value.explain!
    };
}

export const analyticsQuerySQLRequestStore = new AnalyticsQueryRequestStore();
export const analyticsQueryGPTRequestStore = new AnalyticsQueryRequestStore();
