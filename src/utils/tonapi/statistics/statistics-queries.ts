import { useQuery } from "@tanstack/react-query"

import {
  DTOGetProjectTonApiStatsParamsDashboardEnum,
  type DTOStats,
} from "@/api/api.generated"
import { api } from "@/api/client"
import { useSelectedProject } from "@/hooks/use-project"

export type TimePeriod = "last_6h" | "last_24h" | "last_7d" | "last_30d"

export type ChartPoint = {
  time: number
  value: number | null
}

export type LiteproxyStats = {
  requests: ChartPoint[]
  connections: ChartPoint[]
}

const TONAPI_STATS_QUERY_KEY = ["tonapi", "statistics"] as const

export const timePeriods: Array<{ value: TimePeriod; label: string }> = [
  { value: "last_6h", label: "6 hours" },
  { value: "last_24h", label: "24 hours" },
  { value: "last_7d", label: "7 days" },
  { value: "last_30d", label: "30 days" },
]

const periodConfig: Record<
  TimePeriod,
  { durationSeconds: number; stepSeconds: number }
> = {
  last_6h: {
    durationSeconds: 6 * 60 * 60,
    stepSeconds: 60,
  },
  last_24h: {
    durationSeconds: 24 * 60 * 60,
    stepSeconds: 3 * 60,
  },
  last_7d: {
    durationSeconds: 7 * 24 * 60 * 60,
    stepSeconds: 30 * 60,
  },
  last_30d: {
    durationSeconds: 30 * 24 * 60 * 60,
    stepSeconds: 2 * 60 * 60,
  },
}

function getStatsQueryKey(
  projectId: number | null | undefined,
  period: TimePeriod,
  service: "rest" | "liteproxy" | "webhooks"
) {
  return [...TONAPI_STATS_QUERY_KEY, service, projectId, period] as const
}

function getTimestampRange(period: TimePeriod) {
  const end = Math.floor(Date.now() / 1000)
  const start = end - periodConfig[period].durationSeconds

  return { start, end, step: periodConfig[period].stepSeconds }
}

function normalizeStatsValue(value: unknown) {
  if (value == null) {
    return null
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  return Math.round(numericValue * 100) / 100
}

function mapValuesToChartPoints(values: unknown[]): ChartPoint[] {
  return values
    .map((item) => {
      const [timestamp, value] = item as [number | string, unknown]

      return {
        time: Number(timestamp) * 1000,
        value: normalizeStatsValue(value),
      }
    })
    .filter((point) => Number.isFinite(point.time))
    .sort((a, b) => a.time - b.time)
}

function mapStatsToChartPoints(stats: DTOStats): ChartPoint[] {
  const values = stats.result[0]?.values

  if (!values?.length) {
    return []
  }

  return mapValuesToChartPoints(values)
}

export function mapWebhookStatsToChartPoints(
  stats: DTOStats,
  type: "delivered" | "failed"
): ChartPoint[] {
  return stats.result
    .filter((item) => {
      const metric = item.metric as Record<string, unknown>
      return metric.type === type
    })
    .flatMap((item) => mapValuesToChartPoints(item.values))
    .sort((a, b) => a.time - b.time)
}

export function useRestStatsQuery(period: TimePeriod) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getStatsQueryKey(projectId, period, "rest"),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const { start, end, step } = getTimestampRange(period)
      const response = await api.api.getProjectTonApiStats(
        {
          project_id: projectId,
          start,
          end,
          step,
          detailed: false,
        },
        { format: "json" }
      )

      return mapStatsToChartPoints(response.data.stats as DTOStats)
    },
    staleTime: 30 * 1000,
  })
}

export function useLiteproxyStatsQuery(period: TimePeriod) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getStatsQueryKey(projectId, period, "liteproxy"),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const { start, end, step } = getTimestampRange(period)
      const [requestsResponse, connectionsResponse] = await Promise.all([
        api.api.getProjectTonApiStats(
          {
            project_id: projectId,
            start,
            end,
            step,
            detailed: false,
            dashboard:
              DTOGetProjectTonApiStatsParamsDashboardEnum.DTOLiteproxyRequests,
          },
          { format: "json" }
        ),
        api.api.getProjectTonApiStats(
          {
            project_id: projectId,
            start,
            end,
            step,
            detailed: false,
            dashboard:
              DTOGetProjectTonApiStatsParamsDashboardEnum.DTOLiteproxyConnections,
          },
          { format: "json" }
        ),
      ])

      return {
        requests: mapStatsToChartPoints(requestsResponse.data.stats as DTOStats),
        connections: mapStatsToChartPoints(
          connectionsResponse.data.stats as DTOStats
        ),
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useTonApiWebhookStatsQuery(period: TimePeriod) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getStatsQueryKey(projectId, period, "webhooks"),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const { start, end, step } = getTimestampRange(period)
      const response = await api.api.getProjectTonApiStats(
        {
          project_id: projectId,
          start,
          end,
          step,
          detailed: false,
          dashboard: DTOGetProjectTonApiStatsParamsDashboardEnum.DTOTonapiWebhook,
        },
        { format: "json" }
      )

      return response.data.stats as DTOStats
    },
    staleTime: 30 * 1000,
  })
}
