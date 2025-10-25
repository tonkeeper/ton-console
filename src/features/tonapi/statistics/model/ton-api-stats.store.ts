import {
    apiClient,
    createImmediateReaction,
    DTOStats,
    DTOGetProjectTonApiStatsParamsDashboardEnum,
    Loadable
} from 'src/shared';
import { projectsStore } from 'src/shared/stores';
import { makeAutoObservable } from 'mobx';

export interface ChartPoint {
    time: number;
    value: number;
}

export class TonApiStatsStore {
    restStats$ = new Loadable<ChartPoint[] | null>(null);

    liteproxyStats$ = new Loadable<{
        requests: ChartPoint[];
        connections: ChartPoint[];
    } | null>(null);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchStats();
                    this.fetchLiteproxyStats();
                }
            }
        );
    }

    fetchStats = this.restStats$.createAsyncAction(async () => {
        const weekAgo = Math.round(Date.now() / 1000 - 3600 * 24 * 7);
        const end = Math.floor(Date.now() / 1000);
        const halfAnHourPeriod = 60 * 30;

        const response = await apiClient.api.getProjectTonApiStats({
            project_id: projectsStore.selectedProject!.id,
            start: weekAgo,
            step: halfAnHourPeriod,
            end,
            detailed: false
        });

        return mapRestStatsDTOToChartPoints(response.data.stats);
    });

    fetchLiteproxyStats = this.liteproxyStats$.createAsyncAction(async () => {
        const weekAgo = Math.round(Date.now() / 1000 - 3600 * 6);
        const end = Math.floor(Date.now() / 1000);
        const halfAnHourPeriod = 60;

        // Fetch both liteproxy_requests and liteproxy_connections metrics
        const requestsResponse = await apiClient.api.getProjectTonApiStats({
            project_id: projectsStore.selectedProject!.id,
            start: weekAgo,
            step: halfAnHourPeriod,
            end,
            detailed: false,
            dashboard: DTOGetProjectTonApiStatsParamsDashboardEnum.DTOLiteproxyRequests
        });

        const connectionsResponse = await apiClient.api.getProjectTonApiStats({
            project_id: projectsStore.selectedProject!.id,
            start: weekAgo,
            step: halfAnHourPeriod,
            end,
            detailed: false,
            dashboard: DTOGetProjectTonApiStatsParamsDashboardEnum.DTOLiteproxyConnections
        });

        return mapLiteproxyStatsDTOToChartPoints(
            requestsResponse.data.stats,
            connectionsResponse.data.stats
        );
    });

    clearStore(): void {
        this.restStats$.clear();
        this.liteproxyStats$.clear();
    }
}

function mapRestStatsDTOToChartPoints(stats: DTOStats): ChartPoint[] | null {
    if (!stats.result.length) {
        return null;
    }

    const mapToChartPoint = (item: [number, number]): ChartPoint => ({
        time: Number(item[0]) * 1000,
        value: Math.round(Number(item[1]) * 100) / 100
    });

    return stats.result[0].values.map(mapToChartPoint);
}

function mapLiteproxyStatsDTOToChartPoints(
    { result: requestsResult }: DTOStats,
    { result: connectionsResult }: DTOStats
): {
    requests: ChartPoint[];
    connections: ChartPoint[];
} | null {
    if (!requestsResult[0]?.values.length || !connectionsResult[0]?.values.length) {
        return null;
    }

    const requestsChartPoints = requestsResult[0]?.values
        .map(([timestamp, value]) => {
            const time = Number(timestamp) * 1000;
            const normalizedValue = Math.round(Number(value) * 100) / 100;

            return { time, value: normalizedValue };
        })
        .sort((a, b) => a.time - b.time);

    const connectionsChartPoints = connectionsResult[0]?.values
        .map(([timestamp, value]) => {
            const time = Number(timestamp) * 1000;
            const normalizedValue = Math.round(Number(value) * 100) / 100;

            return { time, value: normalizedValue };
        })
        .sort((a, b) => a.time - b.time);

    return {
        requests: requestsChartPoints,
        connections: connectionsChartPoints
    };
}
