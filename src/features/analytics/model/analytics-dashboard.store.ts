import { makeAutoObservable } from 'mobx';
import { createReaction, Loadable } from 'src/shared';
import { AnalyticsDashboardWidget, AnalyticsQuerySuccessful } from './interfaces';
import { projectsStore } from 'src/shared/stores';

class AnalyticsDashboardStore {
    widgets$ = new Loadable<AnalyticsDashboardWidget[]>([]);

    queries$$: Loadable<AnalyticsQuerySuccessful & { dataSource: Record<string, number>[] }>[] = [];

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
        /*
        createReaction(
            () =>
                (this.widgets$.value || '').toString() +
                (this.query$.value?.status || '').toString(),
            () => {
                this.updateChartDatasource.cancelAllPendingCalls();

                if (this.query$.value?.status === 'success') {
                    this.updateChartDatasource();
                } else {
                    this.chartsDatasource$.setValue(null);
                }
            }
        );*/
    }

    /*public fetchWidgets = this.widgets$.createAsyncAction(
        async () => {
            const result = await apiClient.api.getStatsDashboard();
            return parseDDL(result.data as unknown as string);
        },
        { resetBeforeExecution: true }
    );

    addWidget = this.widgets$.createAsyncAction(async (widget: AnalyticsDashboardWidget) => {});

    removeWidget = this.widgets$.createAsyncAction(async (widget: AnalyticsDashboardWidget) => {});

    loadQuery = createAsyncAction(async (id: string) => {
        const result = await apiClient.api.getSqlResultFromStats(id);
        return mapDTOStatsSqlResultToAnalyticsQuery(result.data);
    });*/

    clear(): void {
        this.widgets$.clear();
        this.queries$$ = [];
    }
}

export const analyticsDashboardStore = new AnalyticsDashboardStore();
