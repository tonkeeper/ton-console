import { useQuery } from '@tanstack/react-query';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { getProjectTonApiStats, DTOStats } from 'src/shared/api';

export interface ChartPoint {
    time: number;
    value: number;
}

// Mappers
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

// Query Hooks
export function useRestStats() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['rest-stats', projectId || undefined],
        queryFn: async () => {
            if (!projectId) return null;

            const weekAgo = Math.round(Date.now() / 1000 - 3600 * 24 * 7);
            const end = Math.floor(Date.now() / 1000);
            const halfAnHourPeriod = 60 * 30;

            const { data, error } = await getProjectTonApiStats({
                query: {
                    project_id: projectId,
                    start: weekAgo,
                    step: halfAnHourPeriod,
                    end,
                    detailed: false
                }
            });

            if (error) throw error;

            return mapRestStatsDTOToChartPoints(data.stats as DTOStats);
        },
        enabled: !!projectId,
        staleTime: 30 * 1000 // 30 seconds
    });
}

export function useLiteproxyStats() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['liteproxy-stats', projectId || undefined],
        queryFn: async () => {
            if (!projectId) return null;

            const weekAgo = Math.round(Date.now() / 1000 - 3600 * 6);
            const end = Math.floor(Date.now() / 1000);
            const halfAnHourPeriod = 60;

            // Fetch both liteproxy_requests and liteproxy_connections metrics
            const requestsStatsRequest = getProjectTonApiStats({
                query: {
                    project_id: projectId,
                    start: weekAgo,
                    step: halfAnHourPeriod,
                    end,
                    detailed: false,
                    dashboard: 'liteproxy_requests'
                }
            });

            const connectionsStatRequest = getProjectTonApiStats({
                query: {
                    project_id: projectId,
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
        },
        enabled: !!projectId,
        staleTime: 30 * 1000 // 30 seconds
    });
}
