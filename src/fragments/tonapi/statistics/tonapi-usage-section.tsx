import { useState } from "react"
import { Activity, AlertCircle, Cable, Gauge, Webhook } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelectedProject } from "@/hooks/use-project"
import { getApiErrorMessage } from "@/utils/tonapi/pricing/pricing-utils"
import { useSelectedTonApiTierQuery } from "@/utils/tonapi/pricing/pricing-queries"
import { useSelectedLiteproxyTierQuery } from "@/utils/tonapi/liteservers/liteservers-queries"

import {
  type ChartPoint,
  type TimePeriod,
  mapWebhookStatsToChartPoints,
  timePeriods,
  useLiteproxyStatsQuery,
  useRestStatsQuery,
  useTonApiWebhookStatsQuery,
} from "@/utils/tonapi/statistics/statistics-queries"

const chartConfig = {
  rest: {
    label: "REST API",
    color: "var(--chart-1)",
  },
  liteproxyRequests: {
    label: "Requests",
    color: "var(--chart-1)",
  },
  liteproxyConnections: {
    label: "Connections",
    color: "var(--chart-2)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-1)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function TonApiUsageSection() {
  const [period, setPeriod] = useState<TimePeriod>("last_6h")
  const { selectedProject, selectedProjectId } = useSelectedProject()
  const restStats = useRestStatsQuery(period)
  const liteproxyStats = useLiteproxyStatsQuery(period)
  const webhookStats = useTonApiWebhookStatsQuery(period)
  const tonApiTier = useSelectedTonApiTierQuery()
  const liteproxyTier = useSelectedLiteproxyTierQuery()

  const webhookDelivered = webhookStats.data
    ? mapWebhookStatsToChartPoints(webhookStats.data, "delivered")
    : []
  const webhookFailed = webhookStats.data
    ? mapWebhookStatsToChartPoints(webhookStats.data, "failed")
    : []

  return (
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <CardTitle>TonAPI usage</CardTitle>
          <CardDescription>
            {selectedProject
              ? `Request statistics for ${selectedProject.name}.`
              : "Select or create a project to view TonAPI statistics."}
          </CardDescription>
        </div>
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as TimePeriod)}
        >
          <TabsList aria-label="Select usage period">
            {timePeriods.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {!selectedProjectId ? (
          <Alert>
            <AlertCircle />
            <AlertTitle>No project selected</AlertTitle>
            <AlertDescription>
              Create or select a project before viewing TonAPI usage.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            <MetricCard
              title="REST API requests"
              description="Average requests per second"
              icon={Gauge}
              data={mergeSeries({ rest: restStats.data ?? [] })}
              dataKey="rest"
              limit={tonApiTier.data?.rps}
              isLoading={restStats.isLoading || tonApiTier.isLoading}
              error={restStats.error}
            />
            <MetricCard
              title="Liteservers"
              description="Liteproxy requests and connections"
              icon={Cable}
              data={mergeSeries({
                liteproxyRequests: liteproxyStats.data?.requests ?? [],
                liteproxyConnections: liteproxyStats.data?.connections ?? [],
              })}
              series={[
                { key: "liteproxyRequests", label: "Requests" },
                { key: "liteproxyConnections", label: "Connections" },
              ]}
              limit={liteproxyTier.data?.rps}
              isLoading={liteproxyStats.isLoading || liteproxyTier.isLoading}
              error={liteproxyStats.error}
            />
            <MetricCard
              title="Webhooks"
              description="Delivered and failed webhook events"
              icon={Webhook}
              data={mergeSeries({
                delivered: webhookDelivered,
                failed: webhookFailed,
              })}
              series={[
                { key: "delivered", label: "Delivered" },
                { key: "failed", label: "Failed" },
              ]}
              isLoading={webhookStats.isLoading}
              error={webhookStats.error}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type MetricCardProps = {
  title: string
  description: string
  icon: typeof Activity
  data: ChartDatum[]
  dataKey?: keyof typeof chartConfig
  series?: Array<{ key: keyof typeof chartConfig; label: string }>
  limit?: number
  isLoading: boolean
  error: unknown
}

type ChartDatum = {
  time: number
} & Partial<Record<keyof typeof chartConfig, number | null>>

function MetricCard({
  title,
  description,
  icon: Icon,
  data,
  dataKey,
  series,
  limit,
  isLoading,
  error,
}: MetricCardProps) {
  const chartSeries = series ?? (dataKey ? [{ key: dataKey, label: title }] : [])
  const summary = getMetricSummary(data, chartSeries.map((item) => item.key))
  const hasData = summary.points > 0

  return (
    <Card className="min-h-80">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className="size-4 text-muted-foreground" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {limit ? (
            <Badge variant="secondary">{formatCompactNumber(limit)} rps limit</Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <MetricCardSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to load statistics</AlertTitle>
            <AlertDescription>{getApiErrorMessage(error)}</AlertDescription>
          </Alert>
        ) : hasData ? (
          <>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <MetricSummaryItem
                label="Latest"
                value={formatCompactNumber(summary.latest)}
              />
              <MetricSummaryItem
                label="Average"
                value={formatCompactNumber(summary.average)}
              />
              <MetricSummaryItem
                label="Peak"
                value={formatCompactNumber(summary.peak)}
              />
            </div>
            <ChartContainer
              config={chartConfig}
              className="h-44 w-full"
              initialDimension={{ width: 360, height: 176 }}
            >
              <AreaChart data={data} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={formatChartTick}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis hide domain={[0, "auto"]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        formatDateTime(Number(payload[0]?.payload?.time))
                      }
                    />
                  }
                />
                {limit ? (
                  <ReferenceLine
                    y={limit}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                  />
                ) : null}
                {chartSeries.map((item) => (
                  <Area
                    key={item.key}
                    dataKey={item.key}
                    name={item.label}
                    type="monotone"
                    stroke={`var(--color-${item.key})`}
                    fill={`var(--color-${item.key})`}
                    fillOpacity={0.16}
                    strokeWidth={2}
                    connectNulls
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </>
        ) : (
          <div className="flex h-52 items-center justify-center rounded-md border border-dashed text-center text-sm text-muted-foreground">
            No usage data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
      <Skeleton className="h-44" />
    </div>
  )
}

function MetricSummaryItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="truncate font-mono text-lg font-semibold tabular-nums">
        {value}
      </div>
    </div>
  )
}

function mergeSeries(
  series: Partial<Record<keyof typeof chartConfig, ChartPoint[]>>
): ChartDatum[] {
  const pointsByTime = new Map<number, ChartDatum>()

  Object.entries(series).forEach(([key, points]) => {
    points?.forEach((point) => {
      const current = pointsByTime.get(point.time) ?? { time: point.time }
      pointsByTime.set(point.time, {
        ...current,
        [key]: point.value,
      })
    })
  })

  return Array.from(pointsByTime.values()).sort((a, b) => a.time - b.time)
}

function getMetricSummary(
  data: ChartDatum[],
  keys: Array<keyof typeof chartConfig>
) {
  const values = data.flatMap((item) =>
    keys
      .map((key) => item[key])
      .filter((value): value is number => typeof value === "number")
  )

  const latest = [...data]
    .reverse()
    .flatMap((item) => keys.map((key) => item[key]))
    .find((value): value is number => typeof value === "number")

  if (!values.length) {
    return {
      points: 0,
      latest: null,
      average: null,
      peak: null,
    }
  }

  return {
    points: values.length,
    latest: latest ?? null,
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    peak: Math.max(...values),
  }
}

function formatCompactNumber(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    notation: Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(value) >= 10_000 || value >= 10 ? 1 : 2,
  }).format(value)
}

function formatChartTick(value: number) {
  if (!Number.isFinite(value)) {
    return ""
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatDateTime(value: number) {
  if (!Number.isFinite(value)) {
    return ""
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}
