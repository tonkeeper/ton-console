import {
    apiClient,
    createImmediateReaction,
    DTOStats,
    DTOGetProjectTonApiStatsParamsDashboardEnum,
    Loadable
} from 'src/shared';
import { TonApiStats } from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { makeAutoObservable } from 'mobx';

export class TonApiStatsStore {
    stats$ = new Loadable<TonApiStats | null>(null);

    liteproxyStats$ = new Loadable<TonApiStats | null>(null);

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

    fetchStats = this.stats$.createAsyncAction(async () => {
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

        return mapStatsDTOToTonApiStats(response.data.stats);
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

        return mapLiteproxyStatsDTOToTonApiStats(
            requestsResponse.data.stats,
            connectionsResponse.data.stats
        );
    });

    clearStore(): void {
        this.stats$.clear();
        this.liteproxyStats$.clear();
    }
}

function mapStatsDTOToTonApiStats(stats: DTOStats): TonApiStats | null {
    if (!stats.result.length) {
        return null;
    }

    return {
        chart: stats.result[0].values.map(item => ({
            time: Number(item[0]) * 1000,
            requests: Math.round(Number(item[1]) * 100) / 100
        }))
    };
}

function mapLiteproxyStatsDTOToTonApiStats(
    requestsStats: DTOStats,
    connectionsStats: DTOStats
): TonApiStats | null {
    // Create a map with timestamps as keys
    const timelineMap = new Map<
        number,
        { time: number; liteproxyRequests?: number; liteproxyConnections?: number }
    >();

    // Process requests stats
    if (requestsStats.result.length > 0) {
        requestsStats.result[0].values.forEach(([timestamp, value]) => {
            const time = Number(timestamp) * 1000;

            if (!timelineMap.has(time)) {
                timelineMap.set(time, { time });
            }

            const entry = timelineMap.get(time)!;
            entry.liteproxyRequests = Math.round(Number(value) * 100) / 100;
        });
    }

    // Process connections stats
    if (connectionsStats.result.length > 0) {
        connectionsStats.result[0].values.forEach(([timestamp, value]) => {
            const time = Number(timestamp) * 1000;

            if (!timelineMap.has(time)) {
                timelineMap.set(time, { time });
            }

            const entry = timelineMap.get(time)!;
            entry.liteproxyConnections = Math.round(Number(value) * 100) / 100;
        });
    }

    const chart = Array.from(timelineMap.values()).sort((a, b) => a.time - b.time);

    return chart.length > 0 ? { chart } : null;
}
