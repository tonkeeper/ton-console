import { useMemo, useState } from "react"
import { AlertCircle, BarChart3, Loader2 } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmptyState } from "@/components/empty-state"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiErrorMessage } from "@/utils/tonapi/pricing/pricing-utils"
import {
  type ChartPoint,
  type TimePeriod,
  timePeriods,
  useLiteproxyStatsQuery,
  useRestStatsQuery,
} from "@/utils/tonapi/statistics/statistics-queries"

type TonApiStatisticsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type StatsDatum = {
  time: number
  requests?: number | null
  connections?: number | null
}

const restConfig = {
  requests: {
    label: "Requests",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const liteproxyConfig = {
  requests: {
    label: "Requests",
    color: "var(--chart-1)",
  },
  connections: {
    label: "Connections",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function RestApiStatisticsDialog({
  open,
  onOpenChange,
}: TonApiStatisticsDialogProps) {
  const [period, setPeriod] = useState<TimePeriod>("last_6h")
  const stats = useRestStatsQuery(period)
  const data = useMemo(
    () => mergeSeries({ requests: stats.data ?? [] }),
    [stats.data]
  )

  return (
    <StatisticsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="TonAPI Statistics"
      description="REST API request statistics for the selected period."
      period={period}
      onPeriodChange={setPeriod}
      config={restConfig}
      data={data}
      series={["requests"]}
      isLoading={stats.isLoading}
      error={stats.error}
    />
  )
}

export function LiteproxyStatisticsDialog({
  open,
  onOpenChange,
}: TonApiStatisticsDialogProps) {
  const [period, setPeriod] = useState<TimePeriod>("last_6h")
  const stats = useLiteproxyStatsQuery(period)
  const data = useMemo(
    () =>
      mergeSeries({
        requests: stats.data?.requests ?? [],
        connections: stats.data?.connections ?? [],
      }),
    [stats.data]
  )

  return (
    <StatisticsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Liteservers Statistics"
      description="Liteproxy request and connection statistics for the selected period."
      period={period}
      onPeriodChange={setPeriod}
      config={liteproxyConfig}
      data={data}
      series={["requests", "connections"]}
      isLoading={stats.isLoading}
      error={stats.error}
    />
  )
}

function StatisticsDialog({
  open,
  onOpenChange,
  title,
  description,
  period,
  onPeriodChange,
  config,
  data,
  series,
  isLoading,
  error,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  period: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
  config: ChartConfig
  data: StatsDatum[]
  series: Array<keyof StatsDatum>
  isLoading: boolean
  error: unknown
}) {
  const hasData = data.some((item) =>
    series.some((key) => typeof item[key] === "number")
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Select
            value={period}
            onValueChange={(value) => {
              if (isTimePeriod(value)) {
                onPeriodChange(value)
              }
            }}
          >
            <SelectTrigger className="w-40" aria-label="Select stats period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <LoadingState label="Loading statistics" /> : null}

        {error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error loading statistics</AlertTitle>
            <AlertDescription>{getApiErrorMessage(error)}</AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !error && !hasData ? (
          <EmptyState
            className="min-h-56"
            icon={<BarChart3 />}
            title="No statistics yet"
            description="Usage metrics will appear after requests start."
          />
        ) : null}

        {hasData ? (
          <ChartContainer config={config} className="h-72 w-full">
            <AreaChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickFormatter={formatChartTick}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) =>
                      formatDateTime(Number(payload[0]?.payload?.time))
                    }
                  />
                }
              />
              {series.map((key) => (
                <Area
                  key={String(key)}
                  dataKey={key}
                  type="monotone"
                  fill={`var(--color-${String(key)})`}
                  fillOpacity={0.18}
                  stroke={`var(--color-${String(key)})`}
                  connectNulls
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 animate-spin" />
      {label}
    </div>
  )
}

function mergeSeries(series: Partial<Record<keyof StatsDatum, ChartPoint[]>>) {
  const pointsByTime = new Map<number, StatsDatum>()

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

function isTimePeriod(value: string): value is TimePeriod {
  return timePeriods.some((item) => item.value === value)
}
