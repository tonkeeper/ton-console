import { makeAutoObservable, reaction } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    DTOCharge,
    DTOChargeStatsTypeQuery,
    DTOStatsQueryResult,
    DTOStatsQueryResultType,
    Loadable,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import {
    AnalyticsGraphQuery,
    AnalyticsPayment,
    AnalyticsQuery,
    AnalyticsQueryType,
    AnalyticsRepeatingQuery,
    AnalyticsTablePagination
} from './interfaces';
import { projectsStore } from 'src/entities';
import { mapDTOStatsSqlResultToAnalyticsQuery } from './analytics-query.store';
import { mapDTOStatsGraphResultToAnalyticsGraphQuery } from './analytics-graph-query.store';

class AnalyticsHistoryTableStore {
    queries$ = new Loadable<(AnalyticsQuery | AnalyticsRepeatingQuery | AnalyticsGraphQuery)[]>([]);

    paymentsHistory$ = new Loadable<AnalyticsPayment[]>([]);

    pagination: AnalyticsTablePagination = {
        filter: {
            onlyRepeating: false
        }
    };

    private totalQueries = 0;

    pageSize = 30;

    get hasNextPage(): boolean {
        return this.queries$.value.length < this.totalQueries;
    }

    get tableContentLength(): number {
        return this.hasNextPage ? this.queries$.value.length + 1 : this.queries$.value.length;
    }

    constructor() {
        makeAutoObservable(this);
        let dispose: (() => void) | undefined;

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                dispose?.();
                this.clearState();
                this.pagination = {
                    filter: {
                        onlyRepeating: false
                    }
                };
                this.loadFirstPage.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (project) {
                    this.loadFirstPage();
                    this.fetchPaymentsHistory();

                    dispose = reaction(
                        () => JSON.stringify(this.pagination),
                        () => {
                            this.loadFirstPage({ cancelPreviousCall: true });
                        }
                    );
                }
            }
        );
    }

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.queries$.value.length;

    loadFirstPage = this.queries$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();
            this.totalQueries = 0;

            const response = await apiClient.api.getSqlHistoryFromStats({
                project_id: projectsStore.selectedProject!.id,
                limit: this.pageSize,
                offset: this.queries$.value.length
            });

            const queries = response.data.items.map(mapDTOStatsResultToAnalyticsHistoryResult);

            this.totalQueries = response.data.count;
            return queries;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.queries$.createAsyncAction(async () => {
        const response = await apiClient.api.getSqlHistoryFromStats({
            project_id: projectsStore.selectedProject!.id,
            limit: this.pageSize,
            offset: this.queries$.value.length
        });

        const queries = response.data.items.map(mapDTOStatsResultToAnalyticsHistoryResult);

        this.totalQueries = response.data.count;
        return this.queries$.value.concat(queries);
    });

    fetchPaymentsHistory = this.paymentsHistory$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectStatsPaymentsHistory({
            project_id: projectsStore.selectedProject!.id
        });

        return response.data.history.map(payment => mapDTOPaymentAnalyticsPayment(payment));
    });

    toggleFilterByType = (type: AnalyticsQueryType): void => {
        const typeActive = this.pagination.filter.type?.includes(type);
        if (typeActive) {
            this.pagination.filter.type = this.pagination.filter.type?.filter(i => i !== type);
        } else {
            this.pagination.filter.type = (this.pagination.filter.type || []).concat(type);
        }
    };

    toggleFilterByRepeating = (): void => {
        this.pagination.filter.onlyRepeating = !this.pagination.filter.onlyRepeating;
    };

    clearFilterByType = (): void => {
        this.pagination.filter.type = undefined;
    };

    clearState(): void {
        this.paymentsHistory$.clear();
        this.queries$.clear();
    }
}

function mapDTOStatsResultToAnalyticsHistoryResult(
    value: DTOStatsQueryResult
): AnalyticsQuery | AnalyticsGraphQuery {
    if (value.type === DTOStatsQueryResultType.DTOGraph) {
        return mapDTOStatsGraphResultToAnalyticsGraphQuery(value);
    }

    return mapDTOStatsSqlResultToAnalyticsQuery(value);
}

const subservices = {
    [DTOChargeStatsTypeQuery.DTOGraph]: 'graph',
    [DTOChargeStatsTypeQuery.DTOBaseQuery]: 'query',
    [DTOChargeStatsTypeQuery.DTOChatGptQuery]: 'gpt generation'
} as const;

function mapDTOPaymentAnalyticsPayment(payment: DTOCharge): AnalyticsPayment | null {
    const tonAmount = new TonCurrencyAmount(payment.amount);
    return {
        id: payment.id,
        date: new Date(payment.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(payment.exchange_rate)
        ),
        subservice: subservices[payment.stats_type_query!]
    };
}

export const analyticsHistoryTableStore = new AnalyticsHistoryTableStore();
