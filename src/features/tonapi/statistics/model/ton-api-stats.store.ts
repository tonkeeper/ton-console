import { createImmediateReaction, Loadable } from 'src/shared';
import { DTOStats, getProjectTonApiStats } from 'src/shared/api';
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

        const { data, error } = await getProjectTonApiStats({
            query: {
                project_id: projectsStore.selectedProject!.id,
                start: weekAgo,
                step: halfAnHourPeriod,
                end,
                detailed: false
            }
        });

        if (error) throw error;

        return mapRestStatsDTOToChartPoints(data.stats as DTOStats);
    });

    fetchLiteproxyStats = this.liteproxyStats$.createAsyncAction(async () => {
        const weekAgo = Math.round(Date.now() / 1000 - 3600 * 6);
        const end = Math.floor(Date.now() / 1000);
        const halfAnHourPeriod = 60;

        // Fetch both liteproxy_requests and liteproxy_connections metrics
        const requestsStatsRequest = getProjectTonApiStats({
            query: {
                project_id: projectsStore.selectedProject!.id,
                start: weekAgo,
                step: halfAnHourPeriod,
                end,
                detailed: false,
                dashboard: 'liteproxy_requests'
            }
        });

        const connectionsStatRequest = getProjectTonApiStats({
            query: {
                project_id: projectsStore.selectedProject!.id,
                start: weekAgo,
                step: halfAnHourPeriod,
                end,
                detailed: false,
                dashboard: 'liteproxy_connections'
            }
        });

        const [requestsStats, connectionsStats] = await Promise.all([
            requestsStatsRequest,
            connectionsStatRequest
        ]);

        if (requestsStats.error || connectionsStats.error) {
            throw new Error('Failed to fetch liteproxy stats');
        }

        const requestsStatsData = requestsStats.data.stats as DTOStats;
        const connectionsStatsData = connectionsStats.data.stats as DTOStats;

        return mapLiteproxyStatsDTOToChartPoints(
            requestsStatsData,
            connectionsStatsData
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

    return stats.result[0].values.map((item: unknown) => mapToChartPoint(item as [number, number]));
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
        .map((item: unknown) => {
            const [timestamp, value] = item as [number, number];
            const time = Number(timestamp) * 1000;
            const normalizedValue = Math.round(Number(value) * 100) / 100;

            return { time, value: normalizedValue };
        })
        .sort((a, b) => a.time - b.time);

    const connectionsChartPoints = connectionsResult[0]?.values
        .map((item: unknown) => {
            const [timestamp, value] = item as [number, number];
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
