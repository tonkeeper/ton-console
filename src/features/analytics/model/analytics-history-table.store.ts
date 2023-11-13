import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    DTOStatsQueryResult,
    DTOStatsQueryResultType,
    Loadable
} from 'src/shared';
import { AnalyticsGraphQuery, AnalyticsQuery } from './interfaces';
import { projectsStore } from 'src/entities';
import { mapDTOStatsSqlResultToAnalyticsQuery } from './analytics-query.store';
import { mapDTOStatsGraphResultToAnalyticsGraphQuery } from './analytics-graph-query.store';

class AnalyticsHistoryTableStore {
    queries$ = new Loadable<(AnalyticsQuery | AnalyticsGraphQuery)[]>([]);

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

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();
                this.loadFirstPage.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (project) {
                    this.loadFirstPage();
                }
            }
        );
    }

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.queries$.value.length;

    loadFirstPage = this.queries$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();

            const response = await apiClient.api.getSqlHistoryFromStats({
                project_id: projectsStore.selectedProject!.id,
                limit: this.pageSize,
                offset: this.queries$.value.length
            });

            const invoices = response.data.items.map(mapDTOStatsResultToAnalyticsHistoryResult);

            this.totalQueries = 20; //response.data.count;
            return invoices;
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

        this.totalQueries = 10; // response.data.count;
        return this.queries$.value.concat(queries);
    });

    clearState(): void {
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

export const analyticsHistoryTableStore = new AnalyticsHistoryTableStore();
