import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  BarChart3,
  ExternalLink,
  Loader2,
  Plus,
  RadioTower,
  Search,
  Webhook,
} from "lucide-react"
import { useSearchParams } from "react-router"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { RTWebhookListStatusEnum } from "@/api/webhooks.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelectedProject } from "@/hooks/use-project"

import { CreateWebhookDialog } from "./webhook-dialogs"
import {
  useWebhookStatsQuery,
  useWebhooksQuery,
} from "@/utils/tonapi/webhooks/webhook-queries"
import type { WebhookNetwork } from "@/utils/tonapi/webhooks/webhook-types"
import {
  WEBHOOKS_DOCUMENTATION_URL,
  getApiErrorMessage,
  getStoredWebhookNetwork,
  isUnavailableError,
  isWebhookNetwork,
  mapWebhookStatsToChartPoints,
  storeWebhookNetwork,
  webhookStatsPeriods,
  type WebhookStatsPeriod,
} from "@/utils/tonapi/webhooks/webhook-utils"
import { WebhooksTable } from "./webhooks-table"

export function TonApiWebhooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [statsPeriod, setStatsPeriod] = useState<WebhookStatsPeriod>("last_6h")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | RTWebhookListStatusEnum>("all")
  const [network, setNetworkState] = useState<WebhookNetwork>(() => {
    const queryNetwork = searchParams.get("network")
    return isWebhookNetwork(queryNetwork)
      ? queryNetwork
      : getStoredWebhookNetwork()
  })
  const projectQuery = useSelectedProject()
  const webhooksQuery = useWebhooksQuery(network)
  const statsQuery = useWebhookStatsQuery(network, statsPeriod)

  useEffect(() => {
    storeWebhookNetwork(network)
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (network === "mainnet") {
          next.delete("network")
        } else {
          next.set("network", network)
        }
        return next
      },
      { replace: true }
    )
  }, [network, setSearchParams])

  const setNetwork = (value: string) => {
    if (isWebhookNetwork(value)) {
      setNetworkState(value)
    }
  }

  const webhooks = webhooksQuery.data ?? []
  const filteredWebhooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return webhooks.filter((webhook) => {
      const matchesStatus = status === "all" || webhook.status === status
      const matchesSearch =
        !normalizedSearch ||
        String(webhook.id).includes(normalizedSearch) ||
        webhook.endpoint.toLowerCase().includes(normalizedSearch) ||
        webhook.token.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [search, status, webhooks])
  const isUnavailable =
    webhooksQuery.isError && isUnavailableError(webhooksQuery.error)
  const hasNoWebhooks = webhooksQuery.isSuccess && webhooks.length === 0
  const shouldRenderContentCard =
    projectQuery.isLoading ||
    (!projectQuery.isLoading && !projectQuery.selectedProjectId) ||
    webhooksQuery.isLoading ||
    (webhooksQuery.isError && !isUnavailable) ||
    (webhooksQuery.isSuccess && webhooks.length > 0)

  return (
    <div className="grid gap-4">
      <PageHeader
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            TonAPI Webhooks
            <Badge variant="secondary">{network}</Badge>
          </span>
        }
        description={
          <>
            Manage realtime TonAPI event delivery endpoints for this project.{" "}
            <a
              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              href={WEBHOOKS_DOCUMENTATION_URL}
              target="_blank"
              rel="noreferrer"
            >
              Webhooks documentation
              <ExternalLink className="size-3" />
            </a>
          </>
        }
        actions={
          <>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger size="sm" aria-label="Select webhook network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              disabled={!projectQuery.selectedProjectId}
              onClick={() => setStatsOpen(true)}
            >
              <BarChart3 />
              Statistics
            </Button>
            <Button
              disabled={
                !projectQuery.selectedProjectId || webhooksQuery.isLoading
              }
              onClick={() => setCreateOpen(true)}
            >
              <Plus />
              Create webhook
            </Button>
          </>
        }
      />
      {shouldRenderContentCard ? (
        <Card>
          <CardContent className="grid gap-4">
            {projectQuery.isLoading ? (
              <LoadingState label="Loading project" />
            ) : null}

            {!projectQuery.isLoading && !projectQuery.selectedProjectId ? (
              <Alert>
                <AlertCircle />
                <AlertTitle>No project selected</AlertTitle>
                <AlertDescription>
                  Create or select a project before creating TonAPI webhooks.
                </AlertDescription>
              </Alert>
            ) : null}

            {webhooksQuery.isLoading ? (
              <LoadingState label="Loading webhooks" />
            ) : null}

            {webhooksQuery.isError && !isUnavailable ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error loading webhooks</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(webhooksQuery.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {webhooksQuery.isSuccess && webhooks.length > 0 ? (
              <>
                <WebhookFilters
                  search={search}
                  status={status}
                  onSearchChange={setSearch}
                  onStatusChange={setStatus}
                />
                {filteredWebhooks.length > 0 ? (
                  <WebhooksTable webhooks={filteredWebhooks} network={network} />
                ) : (
                  <EmptyState
                    className="min-h-56"
                    icon={<Search />}
                    title="No matching webhooks"
                    description={`Clear the filters to see all webhooks on ${network}.`}
                    actions={
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearch("")
                          setStatus("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    }
                  />
                )}
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {isUnavailable ? (
        <EmptyState
          className="min-h-96"
          icon={<RadioTower />}
          title="Webhooks are not available"
          description="This project or environment cannot access TonAPI Webhooks yet."
        />
      ) : null}

      {hasNoWebhooks ? (
        <EmptyState
          className="min-h-96"
          icon={<Webhook />}
          title="No webhooks yet"
          description="Create an endpoint to receive TonAPI realtime events."
          actions={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create webhook
            </Button>
          }
        />
      ) : null}

      <CreateWebhookDialog
        network={network}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <WebhookStatsDialog
        open={statsOpen}
        onOpenChange={setStatsOpen}
        period={statsPeriod}
        onPeriodChange={setStatsPeriod}
        stats={statsQuery.data}
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
        error={statsQuery.error}
      />
    </div>
  )
}

function WebhookFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: {
  search: string
  status: "all" | RTWebhookListStatusEnum
  onSearchChange: (value: string) => void
  onStatusChange: (value: "all" | RTWebhookListStatusEnum) => void
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          className="pl-9"
          placeholder="Filter by ID, endpoint, or token"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <Select
        value={status}
        onValueChange={(value) => {
          if (value === "all" || isWebhookStatus(value)) {
            onStatusChange(value)
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value={RTWebhookListStatusEnum.RTOnline}>
            Online
          </SelectItem>
          <SelectItem value={RTWebhookListStatusEnum.RTOffline}>
            Offline
          </SelectItem>
          <SelectItem value={RTWebhookListStatusEnum.RTSuspended}>
            Suspended
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function WebhookStatsDialog({
  open,
  onOpenChange,
  period,
  onPeriodChange,
  stats,
  isLoading,
  isError,
  error,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: WebhookStatsPeriod
  onPeriodChange: (period: WebhookStatsPeriod) => void
  stats: unknown
  isLoading: boolean
  isError: boolean
  error: unknown
}) {
  const data = useMemo(() => buildStatsChartData(stats), [stats])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Webhook Statistics</DialogTitle>
          <DialogDescription>
            Delivered and failed webhook requests for the selected period.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Select
            value={period}
            onValueChange={(value) => {
              if (isWebhookStatsPeriod(value)) {
                onPeriodChange(value)
              }
            }}
          >
            <SelectTrigger className="w-40" aria-label="Select stats period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {webhookStatsPeriods.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <LoadingState label="Loading statistics" /> : null}

        {isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error loading statistics</AlertTitle>
            <AlertDescription>{getApiErrorMessage(error)}</AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !isError && data.length === 0 ? (
          <EmptyState
            className="min-h-56"
            icon={<BarChart3 />}
            title="No statistics yet"
            description="Webhook request metrics will appear after delivery starts."
          />
        ) : null}

        {data.length > 0 ? <WebhookStatsChart data={data} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function WebhookStatsChart({
  data,
}: {
  data: { time: string; delivered: number; failed: number }[]
}) {
  const config = {
    delivered: {
      label: "Delivered",
      color: "var(--chart-2)",
    },
    failed: {
      label: "Failed",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-72 w-full">
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="delivered"
          type="monotone"
          fill="var(--color-delivered)"
          fillOpacity={0.18}
          stroke="var(--color-delivered)"
          stackId="1"
        />
        <Area
          dataKey="failed"
          type="monotone"
          fill="var(--color-failed)"
          fillOpacity={0.18}
          stroke="var(--color-failed)"
          stackId="2"
        />
      </AreaChart>
    </ChartContainer>
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

function buildStatsChartData(stats: unknown) {
  const points = new Map<
    number,
    { timestamp: number; delivered: number; failed: number }
  >()

  for (const point of mapWebhookStatsToChartPoints(stats, "delivered")) {
    points.set(point.timestamp, {
      timestamp: point.timestamp,
      delivered: point.value,
      failed: points.get(point.timestamp)?.failed ?? 0,
    })
  }

  for (const point of mapWebhookStatsToChartPoints(stats, "failed")) {
    points.set(point.timestamp, {
      timestamp: point.timestamp,
      delivered: points.get(point.timestamp)?.delivered ?? 0,
      failed: point.value,
    })
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return Array.from(points.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((point) => ({
      time: formatter.format(point.timestamp),
      delivered: point.delivered,
      failed: point.failed,
    }))
}

function isWebhookStatus(value: string): value is RTWebhookListStatusEnum {
  return (
    value === RTWebhookListStatusEnum.RTOnline ||
    value === RTWebhookListStatusEnum.RTOffline ||
    value === RTWebhookListStatusEnum.RTSuspended
  )
}

function isWebhookStatsPeriod(value: string): value is WebhookStatsPeriod {
  return webhookStatsPeriods.some((item) => item.value === value)
}
