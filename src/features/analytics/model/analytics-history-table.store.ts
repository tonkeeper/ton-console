import { makeAutoObservable } from 'mobx';
import { apiClient, createImmediateReaction, Loadable } from 'src/shared';
import { AnalyticsQuery } from './interfaces';
import { projectsStore } from 'src/entities';
import { mapDTOStatsSqlResultToAnalyticsQuery } from './analytics-query.store';

class AnalyticsHistoryTableStore {
    queries$ = new Loadable<AnalyticsQuery[]>([]);

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

            const invoices = response.data.items.map(mapDTOStatsSqlResultToAnalyticsQuery);

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

        const queries = response.data.items.map(mapDTOStatsSqlResultToAnalyticsQuery);

        this.totalQueries = 10; // response.data.count;
        return this.queries$.value.concat(queries);
    });

    clearState(): void {
        this.queries$.clear();
    }
}

export const analyticsHistoryTableStore = new AnalyticsHistoryTableStore();
