import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createReaction,
    DTOStatsEstimateQuery,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import { AnalyticsQueryTemplate } from './interfaces';
import { projectsStore } from 'src/entities';

class AnalyticsQueryRequestStore {
    request$ = new Loadable<AnalyticsQueryTemplate | null>(null);

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

    public estimateRequest = this.request$.createAsyncAction(async (request: string) => {
        try {
            const result = await apiClient.api.estimateStatsQuery({
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

    setRequest = (template: AnalyticsQueryTemplate) => {
        this.request$.clear(template);
        this.request$.state = 'ready';
    };

    clear(): void {
        this.estimateRequest.cancelAllPendingCalls();
        this.request$.clear();
    }
}

function mapDTOStatsEstimateSQLToAnalyticsQuery(
    request: string,
    value: DTOStatsEstimateQuery
): AnalyticsQueryTemplate {
    return {
        request,
        estimatedTimeMS: value.approximate_time,
        estimatedCost: new TonCurrencyAmount(value.approximate_cost),
        explanation: value.explain!
    };
}

export const analyticsQuerySQLRequestStore = new AnalyticsQueryRequestStore();
export const analyticsQueryGPTRequestStore = new AnalyticsQueryRequestStore();
