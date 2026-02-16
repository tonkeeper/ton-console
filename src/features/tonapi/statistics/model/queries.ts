import { useQuery } from '@tanstack/react-query';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { getProjectTonApiStats, DTOStats } from 'src/shared/api';
import { TimePeriod, getPeriodConfig, getTimestampRange } from './time-periods';

export type { TimePeriod };

export interface ChartPoint {
    time: number;
    value: number | undefined;
}

// Mappers
function mapRestStatsDTOToChartPoints(stats: DTOStats): ChartPoint[] | null {
    if (!stats.result.length) {
        return null;
    }

    const mapToChartPoint = (item: [number, number | null]): ChartPoint => ({
        time: Number(item[0]) * 1000,
        value: item[1] == null ? undefined : Math.round(Number(item[1]) * 100) / 100
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
            const [timestamp, value] = item as [number, number | null];
            const time = Number(timestamp) * 1000;
            const normalizedValue = value == null ? undefined : Math.round(Number(value) * 100) / 100;

            return { time, value: normalizedValue };
        })
        .sort((a, b) => a.time - b.time);

    const connectionsChartPoints = connectionsResult[0]?.values
        .map((item: unknown) => {
            const [timestamp, value] = item as [number, number | null];
            const time = Number(timestamp) * 1000;
            const normalizedValue = value == null ? undefined : Math.round(Number(value) * 100) / 100;

            return { time, value: normalizedValue };
        })
        .sort((a, b) => a.time - b.time);

    return {
        requests: requestsChartPoints,
        connections: connectionsChartPoints
    };
}

// Query Hooks
export function useRestStats(period: TimePeriod = 'last_6h') {
    const projectId = useProjectId();
    const config = getPeriodConfig(period);
    const { start, end } = getTimestampRange(period);

    return useQuery({
        queryKey: ['rest-stats', projectId || undefined, period],
        queryFn: async () => {
            if (!projectId) return null;

            const { data, error } = await getProjectTonApiStats({
                query: {
                    project_id: projectId,
                    start,
                    step: config.stepSeconds,
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

export function useLiteproxyStats(period: TimePeriod = 'last_6h') {
    const projectId = useProjectId();
    const config = getPeriodConfig(period);
    const { start, end } = getTimestampRange(period);

    return useQuery({
        queryKey: ['liteproxy-stats', projectId || undefined, period],
        queryFn: async () => {
            if (!projectId) return null;

            // Fetch both liteproxy_requests and liteproxy_connections metrics
            const requestsStatsRequest = getProjectTonApiStats({
                query: {
                    project_id: projectId,
                    start,
                    step: config.stepSeconds,
                    end,
                    detailed: false,
                    dashboard: 'liteproxy_requests'
                }
            });

            const connectionsStatRequest = getProjectTonApiStats({
                query: {
                    project_id: projectId,
                    start,
                    step: config.stepSeconds,
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
