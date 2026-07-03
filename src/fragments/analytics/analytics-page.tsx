import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  AreaChart,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  LineChart,
  Loader2,
  PieChart,
  Play,
  RefreshCw,
  Repeat,
  Sparkles,
  Table2,
  WalletCards,
  X,
} from "lucide-react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from "recharts"
import { toast } from "sonner"

import {
  DTOStatsQueryStatus,
  DTOStatsQueryType,
  type DTOStatsEstimateQuery,
  type DTOStatsQueryResult,
} from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSelectedProject } from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Link, useNavigate, useSearchParams } from "react-router"

import {
  type AnalyticsChain,
  useCreateStatsGraphMutation,
  useEstimateStatsQueryMutation,
  useGenerateStatsGptSqlMutation,
  useSendStatsQueryMutation,
  useStatsDdlQuery,
  useStatsGptPriceQuery,
  useStatsHistoryQuery,
  useStatsResultQuery,
  useUpdateStatsQueryMutation,
} from "@/utils/analytics/analytics-queries"

const starterSql = "select id from accounts limit 10"
const allHistoryTypes = [
  DTOStatsQueryType.DTOBaseQuery,
  DTOStatsQueryType.DTOChatGptQuery,
  DTOStatsQueryType.DTOGraph,
]
const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function getAnalyticsChainFromSearchParams(searchParams: URLSearchParams) {
  return searchParams.get("network") === "testnet" ? "testnet" : "mainnet"
}

function getDecodedSearchParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key)

  if (!value) {
    return null
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export type AnalyticsPageView = "history" | "query" | "graph"

export function AnalyticsPage({
  view = "history",
}: {
  view?: AnalyticsPageView
}) {
  if (view === "query") {
    return <AnalyticsQueryPage />
  }

  if (view === "graph") {
    return <AnalyticsGraphPage />
  }

  return <AnalyticsHistoryPage />
}

export function AnalyticsHistoryPage() {
  const [historyTypes, setHistoryTypes] =
    useState<DTOStatsQueryType[]>(allHistoryTypes)
  const [onlyRepeating, setOnlyRepeating] = useState(false)
  const selectedProject = useSelectedProject()
  const projectId = selectedProject.selectedProject?.id ?? null
  const typeFilter =
    historyTypes.length === 0 || historyTypes.length === allHistoryTypes.length
      ? undefined
      : historyTypes

  const historyQuery = useStatsHistoryQuery(projectId, undefined, {
    type: typeFilter,
    onlyRepeating,
  })
  const historyPages = historyQuery.data?.pages ?? []
  const historyItems = useMemo(
    () => historyPages.flatMap((page) => page.items),
    [historyPages]
  )
  const historyTotal = historyPages[0]?.count ?? 0

  return (
    <AnalyticsPageFrame
      title="Analytics history"
      description={`Recent stats requests for ${selectedProject.selectedProject?.name ?? "the selected project"}.`}
      selectedProject={selectedProject}
      projectId={projectId}
    >
      <Card>
        <CardContent className="grid gap-4">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-end gap-3">
              <HistoryTypeFilter
                selectedTypes={historyTypes}
                onSelectedTypesChange={setHistoryTypes}
              />
              <Label
                htmlFor="analytics-history-repeating"
                className="flex h-8 min-w-0 items-center gap-2 text-sm font-normal"
              >
                <Checkbox
                  id="analytics-history-repeating"
                  checked={onlyRepeating}
                  onCheckedChange={(value) => setOnlyRepeating(value === true)}
                />
                Only repeating
              </Label>
            </div>
            <div className="flex min-w-0 flex-wrap items-end gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/analytics/query">
                  <Database />
                  New Query
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/analytics/graph">
                  <BarChart3 />
                  New Graph
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={historyQuery.isFetching}
                onClick={() => historyQuery.refetch()}
              >
                {historyQuery.isFetching ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                Refresh
              </Button>
            </div>
          </div>
          <HistoryTable
            items={historyItems}
            total={historyTotal}
            loading={historyQuery.isLoading}
            error={historyQuery.error}
            hasNextPage={historyQuery.hasNextPage}
            isFetchingNextPage={historyQuery.isFetchingNextPage}
            onLoadMore={() => {
              void historyQuery.fetchNextPage()
            }}
          />
        </CardContent>
      </Card>
    </AnalyticsPageFrame>
  )
}

export function AnalyticsQueryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [chain, setChain] = useState<AnalyticsChain>(() =>
    getAnalyticsChainFromSearchParams(searchParams)
  )
  const initialQueryType = searchParams.get("type")
  const initialQuery = getDecodedSearchParam(searchParams, "query")
  const [sql, setSql] = useState(
    initialQueryType === "gpt" ? starterSql : (initialQuery ?? starterSql)
  )
  const [gptPrompt, setGptPrompt] = useState(
    initialQueryType === "gpt" ? (initialQuery ?? "") : ""
  )
  const [gptContext, setGptContext] = useState("")
  const [generatedSql, setGeneratedSql] = useState<{
    prompt: string
    sql: string
    valid: boolean
  } | null>(null)
  const [latestEstimate, setLatestEstimate] =
    useState<DTOStatsEstimateQuery | null>(null)
  const selectedProject = useSelectedProject()
  const projectId = selectedProject.selectedProject?.id ?? null
  const previousProjectId = useRef<number | null>(projectId)
  const activeQueryId = searchParams.get("id")

  const ddlQuery = useStatsDdlQuery(chain)
  const gptPriceQuery = useStatsGptPriceQuery(projectId)
  const resultQuery = useStatsResultQuery(activeQueryId)
  const estimateMutation = useEstimateStatsQueryMutation(projectId)
  const sendMutation = useSendStatsQueryMutation(projectId)
  const generateGptMutation = useGenerateStatsGptSqlMutation(projectId)
  const updateQueryMutation = useUpdateStatsQueryMutation(projectId)

  const currentResult = activeQueryId
    ? (resultQuery.data ??
      (sendMutation.data?.id === activeQueryId ? sendMutation.data : null))
    : (sendMutation.data ?? null)
  const estimate = currentResult?.estimate ?? latestEstimate
  const trimmedSql = sql.trim()
  const canSubmit = Boolean(projectId && trimmedSql)
  const generatedSqlMatchesCurrentQuery =
    Boolean(generatedSql?.sql.trim()) && generatedSql?.sql.trim() === trimmedSql

  useEffect(() => {
    if (!resultQuery.data || resultQuery.data.id !== activeQueryId) {
      return
    }

    if (resultQuery.data.query?.sql) {
      setSql(resultQuery.data.query.sql)
    }

    setLatestEstimate(resultQuery.data.estimate ?? null)
  }, [activeQueryId, resultQuery.data])

  useEffect(() => {
    const nextChain = getAnalyticsChainFromSearchParams(searchParams)

    if (nextChain !== chain) {
      setChain(nextChain)
    }
  }, [chain, searchParams])

  useEffect(() => {
    if (
      previousProjectId.current !== null &&
      projectId !== null &&
      previousProjectId.current !== projectId
    ) {
      navigate("/analytics/history")
    }

    previousProjectId.current = projectId
  }, [navigate, projectId])

  const handleChainChange = (value: AnalyticsChain) => {
    setChain(value)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set("network", value)
      return next
    })
  }

  const handleEstimate = async () => {
    const value = await estimateMutation.mutateAsync({ sql: trimmedSql, chain })
    setLatestEstimate(value)
  }

  const handleRun = async () => {
    const value = await sendMutation.mutateAsync({
      sql: trimmedSql,
      chain,
      estimate: latestEstimate ?? undefined,
      gptMessage: generatedSqlMatchesCurrentQuery
        ? generatedSql?.prompt
        : undefined,
    })
    setSearchParams({ id: value.id, network: chain })
  }

  const handleGenerateSql = async () => {
    const prompt = gptPrompt.trim()
    const context = gptContext.trim()
    const value = await generateGptMutation.mutateAsync({
      message: prompt,
      context,
      chain,
    })
    setGeneratedSql({ prompt, sql: value.message, valid: value.valid })
    setSql(value.message)
    setLatestEstimate(null)
  }

  const handleRepeatUpdate = async (id: string, repeatInterval: number) => {
    await updateQueryMutation.mutateAsync({ id, repeatInterval })
    toast.success(
      repeatInterval > 0
        ? "Query repeat interval updated"
        : "Query repeating stopped"
    )
  }

  return (
    <AnalyticsPageFrame
      title="New request"
      description={`Write SQL, generate it with GPT, inspect schema, and run it against ${selectedProject.selectedProject?.name ?? "the selected project"}.`}
      chain={chain}
      onChainChange={handleChainChange}
      selectedProject={selectedProject}
      projectId={projectId}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-4 text-muted-foreground" />
                SQL query
              </CardTitle>
              <CardDescription>
                Estimate cost first, then run the query and watch its status.
              </CardDescription>
              <CardAction className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!canSubmit || estimateMutation.isPending}
                  onClick={handleEstimate}
                >
                  {estimateMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Clock3 />
                  )}
                  Estimate
                </Button>
                <Button
                  disabled={!canSubmit || sendMutation.isPending}
                  onClick={handleRun}
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Play />
                  )}
                  Run
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Textarea
                value={sql}
                onChange={(event) => setSql(event.target.value)}
                spellCheck={false}
                className="min-h-52 resize-y font-mono text-sm"
              />

              {estimate ? <EstimateSummary estimate={estimate} /> : null}
              {estimateMutation.isError ? (
                <ErrorAlert
                  title="Estimate failed"
                  error={estimateMutation.error}
                />
              ) : null}
              {sendMutation.isError ? (
                <ErrorAlert title="Query failed" error={sendMutation.error} />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="size-4 text-muted-foreground" />
                Query result
              </CardTitle>
              <CardDescription>
                Preview rows are shown when the stats service returns them.
              </CardDescription>
              <CardAction>
                {activeQueryId ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resultQuery.isFetching}
                    onClick={() => resultQuery.refetch()}
                  >
                    {resultQuery.isFetching ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <RefreshCw />
                    )}
                    Refresh
                  </Button>
                ) : null}
              </CardAction>
            </CardHeader>
            <CardContent>
              <QueryResultPanel
                result={currentResult}
                loading={sendMutation.isPending}
                repeatUpdating={updateQueryMutation.isPending}
                repeatError={updateQueryMutation.error}
                onRepeatUpdate={handleRepeatUpdate}
              />
              {resultQuery.isError ? (
                <div className="mt-3">
                  <ErrorAlert
                    title="Could not refresh query status"
                    error={resultQuery.error}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                GPT SQL builder
              </CardTitle>
              <CardDescription>
                Generate SQL from a natural language request, then estimate and
                run it in the SQL panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GptSqlBuilder
                prompt={gptPrompt}
                context={gptContext}
                generatedSql={generatedSql}
                price={gptPriceQuery.data}
                loadingPrice={gptPriceQuery.isLoading}
                priceError={gptPriceQuery.error}
                generating={generateGptMutation.isPending}
                error={generateGptMutation.error}
                onPromptChange={setGptPrompt}
                onContextChange={setGptContext}
                onGenerate={handleGenerateSql}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Stats schema
              </CardTitle>
              <CardDescription>
                DDL returned by the stats service for the selected chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DdlPanel
                ddl={ddlQuery.data}
                loading={ddlQuery.isLoading}
                error={ddlQuery.error}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AnalyticsPageFrame>
  )
}

export function AnalyticsGraphPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [chain, setChain] = useState<AnalyticsChain>(() =>
    getAnalyticsChainFromSearchParams(searchParams)
  )
  const [graphAddresses, setGraphAddresses] = useState("")
  const [graphOnlyBetween, setGraphOnlyBetween] = useState(false)
  const selectedProject = useSelectedProject()
  const projectId = selectedProject.selectedProject?.id ?? null
  const activeGraphQueryId = searchParams.get("id")

  const graphResultQuery = useStatsResultQuery(activeGraphQueryId)
  const graphMutation = useCreateStatsGraphMutation(projectId)
  const graphAddressesList = parseGraphAddresses(graphAddresses)
  const graphValidationError = getGraphValidationError(graphAddressesList)
  const graphResult = activeGraphQueryId
    ? (graphResultQuery.data ??
      (graphMutation.data?.id === activeGraphQueryId
        ? graphMutation.data
        : null))
    : null

  useEffect(() => {
    if (!graphResult || graphResult.id !== activeGraphQueryId) {
      return
    }

    if (graphResult.query?.addresses?.length) {
      setGraphAddresses(graphResult.query.addresses.join("\n"))
    }

    setGraphOnlyBetween(graphResult.query?.only_between === true)
  }, [activeGraphQueryId, graphResult])

  useEffect(() => {
    const nextChain = getAnalyticsChainFromSearchParams(searchParams)

    if (nextChain !== chain) {
      setChain(nextChain)
    }
  }, [chain, searchParams])

  const handleChainChange = (value: AnalyticsChain) => {
    setChain(value)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set("network", value)
      return next
    })
  }

  const handleCreateGraph = async () => {
    const value = await graphMutation.mutateAsync({
      addresses: graphAddressesList,
      onlyBetween: graphOnlyBetween,
      chain,
    })
    setSearchParams({ id: value.id, network: chain })
  }

  return (
    <AnalyticsPageFrame
      title="Graph"
      description="Build a transaction graph for the accounts you are interested in."
      chain={chain}
      onChainChange={handleChainChange}
      selectedProject={selectedProject}
      projectId={projectId}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              Graph builder
            </CardTitle>
            <CardDescription>
              Enter up to 10 accounts or TON DNS names to visualize their
              transaction history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraphQueryBuilder
              addresses={graphAddresses}
              onlyBetween={graphOnlyBetween}
              validationError={graphValidationError}
              result={graphResult}
              loading={graphMutation.isPending}
              refreshing={graphResultQuery.isFetching}
              error={graphMutation.error ?? graphResultQuery.error}
              onAddressesChange={setGraphAddresses}
              onOnlyBetweenChange={setGraphOnlyBetween}
              onCreate={handleCreateGraph}
              onRefresh={() => graphResultQuery.refetch()}
              onNewRequest={() => setSearchParams({})}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request details</CardTitle>
            <CardDescription>
              Successful graph requests open in Cosmograph when the stats
              service returns result URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            <p>The request can cost from $0.01 up to $5.</p>
            <p>
              Use "Only between these accounts" when you want to hide
              transactions involving accounts outside your list.
            </p>
          </CardContent>
        </Card>
      </div>
    </AnalyticsPageFrame>
  )
}

function AnalyticsPageFrame({
  title,
  description,
  chain,
  onChainChange,
  selectedProject,
  projectId,
  children,
}: {
  title: string
  description: string
  chain?: AnalyticsChain
  onChainChange?: (value: AnalyticsChain) => void
  selectedProject: ReturnType<typeof useSelectedProject>
  projectId: number | null
  children: ReactNode
}) {
  if (selectedProject.isLoading) {
    return <AnalyticsPageSkeleton />
  }

  if (selectedProject.error) {
    return (
      <ErrorAlert
        title="Project state could not be loaded"
        error={selectedProject.error}
      />
    )
  }

  if (!projectId) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WalletCards />
          </EmptyMedia>
          <EmptyTitle>No selected project</EmptyTitle>
          <EmptyDescription>
            Select or create a project to use Analytics.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title={title}
        description={description}
        actions={
          chain && onChainChange ? (
            <Select
              value={chain}
              onValueChange={(value) => onChainChange(value as AnalyticsChain)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
          ) : null
        }
      />

      {children}
    </div>
  )
}

function GptSqlBuilder({
  prompt,
  context,
  generatedSql,
  price,
  loadingPrice,
  priceError,
  generating,
  error,
  onPromptChange,
  onContextChange,
  onGenerate,
}: {
  prompt: string
  context: string
  generatedSql: { prompt: string; sql: string; valid: boolean } | null
  price?: { free_requests: number; used: number; usd_price: number } | null
  loadingPrice: boolean
  priceError: unknown
  generating: boolean
  error: unknown
  onPromptChange: (value: string) => void
  onContextChange: (value: string) => void
  onGenerate: () => void
}) {
  const trimmedPrompt = prompt.trim()

  return (
    <div className="grid gap-3">
      <Textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder="Describe the stats query you need..."
        spellCheck={false}
        className="min-h-28 resize-y text-sm"
      />
      <Textarea
        value={context}
        onChange={(event) => onContextChange(event.target.value)}
        placeholder="Optional context for GPT"
        spellCheck={false}
        className="min-h-20 resize-y text-sm"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <GptPriceLabel
          price={price}
          loading={loadingPrice}
          error={priceError}
        />
        <Button
          size="sm"
          disabled={!trimmedPrompt || generating}
          onClick={onGenerate}
        >
          {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Generate
        </Button>
      </div>

      {generatedSql ? (
        <Alert variant={generatedSql.valid ? "default" : "destructive"}>
          {generatedSql.valid ? <CheckCircle2 /> : <AlertCircle />}
          <AlertTitle>
            {generatedSql.valid
              ? "SQL generated"
              : "Generated SQL needs review"}
          </AlertTitle>
          <AlertDescription>
            The generated SQL has been copied into the SQL editor. Estimate and
            run it there when ready.
          </AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <PaymentAwareError title="GPT request failed" error={error} />
      ) : null}
    </div>
  )
}

function GptPriceLabel({
  price,
  loading,
  error,
}: {
  price?: { free_requests: number; used: number; usd_price: number } | null
  loading: boolean
  error: unknown
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading price
      </span>
    )
  }

  if (error) {
    return (
      <span className="text-sm text-destructive">
        Price could not be loaded
      </span>
    )
  }

  if (!price) {
    return null
  }

  const freeLeft = Math.max(price.free_requests - price.used, 0)

  return (
    <span className="text-sm text-muted-foreground">
      {freeLeft > 0
        ? `${freeLeft} free request${freeLeft === 1 ? "" : "s"} left`
        : `Costs up to ${formatUsd(price.usd_price)}`}
    </span>
  )
}

function GraphQueryBuilder({
  addresses,
  onlyBetween,
  validationError,
  result,
  loading,
  refreshing,
  error,
  onAddressesChange,
  onOnlyBetweenChange,
  onCreate,
  onRefresh,
  onNewRequest,
}: {
  addresses: string
  onlyBetween: boolean
  validationError: string | null
  result: DTOStatsQueryResult | null
  loading: boolean
  refreshing: boolean
  error: unknown
  onAddressesChange: (value: string) => void
  onOnlyBetweenChange: (value: boolean) => void
  onCreate: () => void
  onRefresh: () => void
  onNewRequest: () => void
}) {
  const canSubmit = Boolean(addresses.trim()) && !validationError
  const graphUrl = getGraphResultUrl(result)

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-2">
        <Checkbox
          id="analytics-graph-only-between"
          checked={onlyBetween}
          disabled={loading}
          onCheckedChange={(value) => onOnlyBetweenChange(value === true)}
        />
        <Label
          htmlFor="analytics-graph-only-between"
          className="grid gap-1 leading-normal"
        >
          <span>Only between these accounts</span>
          <span className="text-xs font-normal text-muted-foreground">
            Otherwise transactions where either sender or recipient is listed
            are included.
          </span>
        </Label>
      </div>

      <Textarea
        value={addresses}
        onChange={(event) => onAddressesChange(event.target.value)}
        placeholder="One address or TON DNS name per line"
        spellCheck={false}
        disabled={loading}
        className="min-h-36 resize-y font-mono text-sm"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          The request can cost from $0.01 up to $5.
        </span>
        <Button size="sm" disabled={!canSubmit || loading} onClick={onCreate}>
          {loading ? <Loader2 className="animate-spin" /> : <BarChart3 />}
          Send
        </Button>
      </div>

      {validationError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Check addresses</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      ) : null}

      {result ? (
        <div className="grid gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={result.status} />
            <span className="text-sm text-muted-foreground">
              {formatDate(result.date_create)}
            </span>
            {result.usd_cost ? (
              <span className="text-sm text-muted-foreground">
                Cost {formatUsd(result.usd_cost)}
              </span>
            ) : null}
          </div>

          {result.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Graph request failed</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {graphUrl ? (
              <Button asChild size="sm">
                <a href={graphUrl} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  Show result
                </a>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              disabled={refreshing}
              onClick={onRefresh}
            >
              {refreshing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <RefreshCw />
              )}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onNewRequest}>
              New request
            </Button>
            {result.query?.addresses?.length ? (
              <CopyAddressesButton addresses={result.query.addresses} />
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <PaymentAwareError title="Graph request failed" error={error} />
      ) : null}
    </div>
  )
}

function CopyAddressesButton({ addresses }: { addresses: string[] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(addresses.join("\n"))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy />
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

function PaymentAwareError({
  title,
  error,
}: {
  title: string
  error: unknown
}) {
  const neededUsd = getNeededUsd(error)

  if (typeof neededUsd === "number") {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Insufficient balance</AlertTitle>
        <AlertDescription>
          Add at least {formatUsd(neededUsd)} to the project balance to
          continue.
        </AlertDescription>
      </Alert>
    )
  }

  return <ErrorAlert title={title} error={error} />
}

function parseGraphAddresses(value: string) {
  return value
    .split("\n")
    .map((line) => line.replaceAll(/[,; \t\v\f\r]/g, "").trim())
    .filter(Boolean)
    .map((line) =>
      /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-.]+$/.test(line)
        ? line.toLowerCase()
        : line
    )
}

function getGraphValidationError(addresses: string[]) {
  if (!addresses.length) {
    return null
  }

  if (addresses.length > 10) {
    return "Enter up to 10 addresses."
  }

  const invalidAddress = addresses.find(
    (address) => !/^[a-zA-Z0-9_.:-]+$/.test(address)
  )

  if (invalidAddress) {
    return `Invalid address or DNS name: ${invalidAddress}`
  }

  return null
}

function getGraphResultUrl(result: DTOStatsQueryResult | null) {
  if (
    result?.status !== DTOStatsQueryStatus.DTOSuccess ||
    !result.url ||
    !result.meta_url
  ) {
    return null
  }

  const data = encodeURIComponent(result.url)
  const meta = encodeURIComponent(result.meta_url)

  return `https://cosmograph.app/run/?nodeColor=color-node_color&nodeSize=size-node_value&data=${data}&meta=${meta}`
}

function EstimateSummary({ estimate }: { estimate: DTOStatsEstimateQuery }) {
  const [explainOpen, setExplainOpen] = useState(false)

  return (
    <>
      <div className="grid gap-2 rounded-lg border bg-muted/30 p-3 text-sm md:grid-cols-3">
        <Metric
          label="Approximate time"
          value={formatDuration(estimate.approximate_time)}
        />
        <Metric
          label="Approximate cost"
          value={formatUsd(estimate.approximate_usd_cost)}
        />
        <div className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Explain
          </span>
          {estimate.explain ? (
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => setExplainOpen(true)}
            >
              <FileSearch />
              View plan
            </Button>
          ) : (
            <span className="font-medium break-words">No explain returned</span>
          )}
        </div>
      </div>
      <ExplainSqlDialog
        open={explainOpen}
        onOpenChange={setExplainOpen}
        explanation={estimate.explain}
      />
    </>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-medium break-words">{value}</span>
    </div>
  )
}

function QueryResultPanel({
  result,
  loading,
  repeatUpdating,
  repeatError,
  onRepeatUpdate,
}: {
  result: DTOStatsQueryResult | null
  loading: boolean
  repeatUpdating: boolean
  repeatError: unknown
  onRepeatUpdate: (id: string, repeatInterval: number) => Promise<void>
}) {
  const [repeatOpen, setRepeatOpen] = useState(false)
  const [explainOpen, setExplainOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 animate-spin" />
        Sending query
      </div>
    )
  }

  if (!result) {
    return (
      <Empty className="min-h-56 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table2 />
          </EmptyMedia>
          <EmptyTitle>No query selected</EmptyTitle>
          <EmptyDescription>
            Run a SQL query or open one from history to see its status.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const canManageRepeat =
    result.status === DTOStatsQueryStatus.DTOSuccess &&
    result.type !== DTOStatsQueryType.DTOGraph
  const repeatInterval = result.query?.repeat_interval

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={result.status} />
        <Badge variant="secondary">{formatQueryType(result.type)}</Badge>
        <span className="text-sm text-muted-foreground">
          {formatDate(result.date_create)}
        </span>
        {result.spent_time ? (
          <span className="text-sm text-muted-foreground">
            Spent {formatDuration(result.spent_time)}
          </span>
        ) : null}
        {repeatInterval ? (
          <Badge variant="outline">
            <Repeat className="size-3" />
            Every {formatRepeatInterval(repeatInterval)}
          </Badge>
        ) : null}
      </div>

      {result.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Stats service returned an error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : null}

      {result.url ||
      result.meta_url ||
      result.estimate?.explain ||
      canManageRepeat ? (
        <div className="flex flex-wrap gap-2">
          {result.estimate?.explain ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExplainOpen(true)}
            >
              <FileSearch />
              Explain
            </Button>
          ) : null}
          {result.url ? (
            <Button asChild variant="outline" size="sm">
              <a href={result.url} target="_blank" rel="noreferrer">
                <Download />
                Download CSV
              </a>
            </Button>
          ) : null}
          {result.meta_url ? (
            <Button asChild variant="outline" size="sm">
              <a href={result.meta_url} target="_blank" rel="noreferrer">
                <Download />
                Download metadata
              </a>
            </Button>
          ) : null}
          <CopyPreviewButton result={result} />
          {canManageRepeat ? (
            <Button
              variant="outline"
              size="sm"
              disabled={repeatUpdating}
              onClick={() => setRepeatOpen(true)}
            >
              {repeatUpdating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Repeat />
              )}
              Repeat request
              {repeatInterval
                ? ` · ${formatRepeatInterval(repeatInterval)}`
                : null}
            </Button>
          ) : null}
        </div>
      ) : null}

      {repeatError ? (
        <PaymentAwareError title="Repeat update failed" error={repeatError} />
      ) : null}

      <ChartsPanel result={result} />
      <PreviewTable result={result} />
      <ExplainSqlDialog
        open={explainOpen}
        onOpenChange={setExplainOpen}
        request={result.query?.sql}
        explanation={result.estimate?.explain}
      />
      <RepeatRequestDialog
        open={repeatOpen}
        onOpenChange={setRepeatOpen}
        result={result}
        updating={repeatUpdating}
        onRepeatUpdate={onRepeatUpdate}
      />
    </div>
  )
}

function CopyPreviewButton({ result }: { result: DTOStatsQueryResult }) {
  const preview = result.preview ?? []
  const headings = preview[0] ?? []
  const rows = preview.slice(1)

  if (!headings.length || !rows.length) {
    return null
  }

  const handleCopy = async () => {
    await copyToClipboard(
      preview.map((row) => row.join("\t")).join("\n")
    )
    toast.success(
      result.all_data_in_preview
        ? "Preview copied"
        : `Copied preview of ${rows.length} rows`
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy />
      Copy preview
    </Button>
  )
}

function ExplainSqlDialog({
  open,
  onOpenChange,
  request,
  explanation,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request?: string
  explanation?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Explain SQL</DialogTitle>
          <DialogDescription>
            Execution plan returned by the stats estimate response.
          </DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[70vh] gap-3 overflow-auto">
          {request ? (
            <pre className="overflow-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap">
              {request.trim()}
            </pre>
          ) : null}
          {explanation ? (
            <pre className="overflow-auto rounded-lg border bg-background p-3 font-mono text-xs whitespace-pre-wrap">
              {explanation.trim()}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">
              No explain text was returned for this query.
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type RepeatIntervalUnit = "day" | "hour" | "minute"

const repeatIntervalUnits: Array<{
  value: RepeatIntervalUnit
  label: string
  seconds: number
}> = [
  { value: "day", label: "Days", seconds: 60 * 60 * 24 },
  { value: "hour", label: "Hours", seconds: 60 * 60 },
  { value: "minute", label: "Minutes", seconds: 60 },
]

function RepeatRequestDialog({
  open,
  onOpenChange,
  result,
  updating,
  onRepeatUpdate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: DTOStatsQueryResult
  updating: boolean
  onRepeatUpdate: (id: string, repeatInterval: number) => Promise<void>
}) {
  const currentRepeat = result.query?.repeat_interval ?? 0
  const defaultUnit = getRepeatIntervalUnit(currentRepeat)
  const [repeatEnabled, setRepeatEnabled] = useState(currentRepeat > 0)
  const [unit, setUnit] = useState<RepeatIntervalUnit>(defaultUnit)
  const [frequency, setFrequency] = useState(() =>
    currentRepeat > 0
      ? String(Math.max(currentRepeat / getRepeatUnitSeconds(defaultUnit), 1))
      : "1"
  )
  const parsedFrequency = Number(frequency)
  const nextRepeatInterval = repeatEnabled
    ? parsedFrequency * getRepeatUnitSeconds(unit)
    : 0
  const isFrequencyInvalid =
    repeatEnabled && (!Number.isInteger(parsedFrequency) || parsedFrequency < 1)
  const isDirty = currentRepeat !== nextRepeatInterval

  useEffect(() => {
    if (!open) {
      return
    }

    const nextUnit = getRepeatIntervalUnit(currentRepeat)
    setRepeatEnabled(currentRepeat > 0)
    setUnit(nextUnit)
    setFrequency(
      currentRepeat > 0
        ? String(Math.max(currentRepeat / getRepeatUnitSeconds(nextUnit), 1))
        : "1"
    )
  }, [currentRepeat, open])

  const handleSubmit = async () => {
    if (isFrequencyInvalid || !isDirty) {
      return
    }

    await onRepeatUpdate(result.id, nextRepeatInterval)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repeat request</DialogTitle>
          <DialogDescription>
            Schedule this successful SQL request to run at a fixed interval.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <RadioGroup
            value={repeatEnabled ? "repeat" : "once"}
            onValueChange={(value) => setRepeatEnabled(value === "repeat")}
          >
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="once" />
              Not repeated
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="repeat" />
              Repeat every
            </Label>
          </RadioGroup>
          <div className="grid gap-2 pl-6">
            <div className="flex max-w-xs gap-2">
              <Input
                type="number"
                min={1}
                step={1}
                value={frequency}
                disabled={!repeatEnabled || updating}
                aria-invalid={isFrequencyInvalid}
                onChange={(event) => setFrequency(event.target.value)}
              />
              <Select
                value={unit}
                disabled={!repeatEnabled || updating}
                onValueChange={(value) => setUnit(value as RepeatIntervalUnit)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {repeatIntervalUnits.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isFrequencyInvalid ? (
              <p className="text-sm text-destructive">
                Enter a positive whole number.
              </p>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!isDirty || isFrequencyInvalid || updating}
            onClick={handleSubmit}
          >
            {updating ? <Loader2 className="animate-spin" /> : <Repeat />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ChartKind = "bar" | "area" | "line" | "pie"
type ChartDatum = Record<string, string | number>

const chartTypeOptions: Array<{
  type: ChartKind
  label: string
  icon: typeof BarChart3
}> = [
  { type: "bar", label: "Bar chart", icon: BarChart3 },
  { type: "area", label: "Area chart", icon: AreaChart },
  { type: "line", label: "Line chart", icon: LineChart },
  { type: "pie", label: "Pie chart", icon: PieChart },
]

function ChartsPanel({ result }: { result: DTOStatsQueryResult }) {
  const [charts, setCharts] = useState<ChartKind[]>([])
  const [dataSource, setDataSource] = useState<ChartDatum[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCharts([])
    setDataSource(null)
    setError(null)
    setLoading(false)
  }, [result.id])

  useEffect(() => {
    if (!charts.length || dataSource || loading || !result.url) {
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(result.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`CSV returned ${response.status}`)
        }

        return response.text()
      })
      .then((csv) => {
        if (!cancelled) {
          setDataSource(parseCsvToChartData(csv))
        }
      })
      .catch((csvError: unknown) => {
        if (!cancelled) {
          setError(getApiErrorMessage(csvError))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [charts.length, dataSource, loading, result.url])

  if (result.status !== DTOStatsQueryStatus.DTOSuccess || !result.url) {
    return null
  }

  const addChart = (type: ChartKind) => {
    setCharts((current) =>
      current.includes(type) ? current : current.concat(type)
    )
  }
  const removeChart = (type: ChartKind) => {
    setCharts((current) => current.filter((item) => item !== type))
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">Visualisations</div>
          <p className="text-sm text-muted-foreground">
            Build charts from numeric columns in the CSV result.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <BarChart3 />
              Add visualisation
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {chartTypeOptions.map((option) => (
              <DropdownMenuItem
                key={option.type}
                disabled={charts.includes(option.type)}
                onClick={() => addChart(option.type)}
              >
                <option.icon />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="flex h-36 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          <Loader2 className="mr-2 animate-spin" />
          Loading chart data
        </div>
      ) : null}
      {error ? (
        <ErrorAlert title="Charts could not be loaded" error={error} />
      ) : null}
      {dataSource && charts.length ? (
        <div className="grid gap-3 xl:grid-cols-2">
          {charts.map((chart) => (
            <ChartCard
              key={chart}
              type={chart}
              dataSource={dataSource}
              onClose={() => removeChart(chart)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ChartCard({
  type,
  dataSource,
  onClose,
}: {
  type: ChartKind
  dataSource: ChartDatum[]
  onClose: () => void
}) {
  const option = chartTypeOptions.find((item) => item.type === type)!
  const keys = Object.keys(dataSource[0] ?? {})
  const xKey = keys[0]
  const numericKeys = getNumericKeys(dataSource).filter((key) => key !== xKey)
  const pieKeys = getNumericKeys(dataSource)
  const config = useMemo(
    () => buildChartConfig(type === "pie" ? pieKeys : numericKeys),
    [numericKeys, pieKeys, type]
  )

  return (
    <div className="grid gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <option.icon className="size-4 text-muted-foreground" />
          {option.label}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${option.label}`}
                onClick={onClose}
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove {option.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {type === "pie" ? (
        <PieChartView dataSource={dataSource} keys={pieKeys} config={config} />
      ) : numericKeys.length && xKey ? (
        <CartesianChartView
          type={type}
          dataSource={dataSource}
          xKey={xKey}
          numericKeys={numericKeys}
          config={config}
        />
      ) : (
        <p className="flex h-48 items-center justify-center text-center text-sm text-muted-foreground">
          This result needs at least one label column and one numeric data
          column.
        </p>
      )}
    </div>
  )
}

function CartesianChartView({
  type,
  dataSource,
  xKey,
  numericKeys,
  config,
}: {
  type: Exclude<ChartKind, "pie">
  dataSource: ChartDatum[]
  xKey: string
  numericKeys: string[]
  config: ChartConfig
}) {
  const common = (
    <>
      <CartesianGrid vertical={false} />
      <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} width={48} />
      <ChartTooltip content={<ChartTooltipContent />} />
    </>
  )

  return (
    <ChartContainer config={config} className="h-72 w-full">
      {type === "bar" ? (
        <BarChart data={dataSource}>
          {common}
          {numericKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={chartColors[index % chartColors.length]}
              radius={3}
            />
          ))}
        </BarChart>
      ) : type === "area" ? (
        <RechartsAreaChart data={dataSource}>
          {common}
          {numericKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={chartColors[index % chartColors.length]}
              fill={chartColors[index % chartColors.length]}
              fillOpacity={0.4}
            />
          ))}
        </RechartsAreaChart>
      ) : (
        <RechartsLineChart data={dataSource}>
          {common}
          {numericKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      )}
    </ChartContainer>
  )
}

function PieChartView({
  dataSource,
  keys,
  config,
}: {
  dataSource: ChartDatum[]
  keys: string[]
  config: ChartConfig
}) {
  if (dataSource.length !== 1 || !keys.length) {
    return (
      <p className="flex h-48 items-center justify-center text-center text-sm text-muted-foreground">
        Pie charts require exactly one row with numeric values.
      </p>
    )
  }

  const data = keys.map((key) => ({
    name: key,
    value: Number(dataSource[0][key]),
  }))

  return (
    <ChartContainer config={config} className="h-72 w-full">
      <RechartsPieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={92}>
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  )
}

function PreviewTable({ result }: { result: DTOStatsQueryResult }) {
  const preview = result.preview ?? []
  const headings = preview[0] ?? []
  const rows = preview.slice(1)

  if (!preview.length || !headings.length) {
    return (
      <Empty className="min-h-40 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table2 />
          </EmptyMedia>
          <EmptyTitle>No preview rows</EmptyTitle>
          <EmptyDescription>
            {result.status === DTOStatsQueryStatus.DTOExecuting
              ? "The query is still executing."
              : "Open the CSV link when available for full output."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-2">
      {!result.all_data_in_preview ? (
        <p className="text-sm text-muted-foreground">
          Showing a preview of {rows.length} rows. Download CSV for full output.
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              {headings.map((heading, index) => (
                <TableHead key={`${heading}-${index}`} className="font-mono">
                  {heading || "-"}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headings.map((_, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="max-w-72 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap"
                    title={row[cellIndex]}
                  >
                    {row[cellIndex] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function HistoryTypeFilter({
  selectedTypes,
  onSelectedTypesChange,
}: {
  selectedTypes: DTOStatsQueryType[]
  onSelectedTypesChange: (types: DTOStatsQueryType[]) => void
}) {
  const activeCount =
    selectedTypes.length === allHistoryTypes.length ? 0 : selectedTypes.length

  const toggleType = (type: DTOStatsQueryType) => {
    if (selectedTypes.length === 1 && selectedTypes.includes(type)) {
      onSelectedTypesChange(allHistoryTypes)
      return
    }

    onSelectedTypesChange(
      selectedTypes.includes(type)
        ? selectedTypes.filter((item) => item !== type)
        : selectedTypes.concat(type)
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Table2 />
          Type
          <span
            className={cn(
              "rounded-full bg-muted px-1.5 text-xs text-muted-foreground",
              activeCount > 0 && "bg-primary text-primary-foreground"
            )}
          >
            {activeCount || "All"}
          </span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Display only</DropdownMenuLabel>
        {allHistoryTypes.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type)}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={() => toggleType(type)}
          >
            {formatQueryType(type)}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onSelectedTypesChange(allHistoryTypes)}
        >
          Clear filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HistoryTable({
  items,
  total,
  loading,
  error,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  items: DTOStatsQueryResult[]
  total: number
  loading: boolean
  error: unknown
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const openHistoryItem = (item: DTOStatsQueryResult) => {
    void navigate(getHistoryItemHref(item))
  }

  useEffect(() => {
    if (!hasNextPage || loading || isFetchingNextPage) {
      return
    }

    const node = loadMoreRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore()
        }
      },
      { rootMargin: "240px" }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, loading, onLoadMore])

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  if (error) {
    return <ErrorAlert title="History could not be loaded" error={error} />
  }

  if (!items.length) {
    return (
      <Empty className="min-h-56 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock3 />
          </EmptyMedia>
          <EmptyTitle>No recent queries</EmptyTitle>
          <EmptyDescription>
            Run a query and it will appear in this history table.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm text-muted-foreground">
        Showing {items.length} of {total} matching requests.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Repeating</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                role="link"
                tabIndex={0}
                className="cursor-pointer focus-visible:bg-muted focus-visible:outline-none"
                onClick={() => openHistoryItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openHistoryItem(item)
                  }
                }}
              >
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="max-w-[420px] overflow-hidden text-ellipsis">
                  <div className="truncate">
                    {item.query?.sql ||
                      item.query?.gpt_message ||
                      item.name ||
                      item.id}
                  </div>
                </TableCell>
                <TableCell>{formatQueryType(item.type)}</TableCell>
                <TableCell>{formatRepeatingSummary(item)}</TableCell>
                <TableCell>
                  {item.total_usd_cost
                    ? formatUsd(item.total_usd_cost)
                    : formatUsd(item.usd_cost)}
                </TableCell>
                <TableCell>{formatDate(item.date_create)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasNextPage ? (
        <div
          ref={loadMoreRef}
          className="flex min-h-10 items-center justify-center text-sm text-muted-foreground"
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading more
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function getHistoryItemHref(item: DTOStatsQueryResult) {
  const query = new URLSearchParams({ id: item.id }).toString()

  if (item.type === DTOStatsQueryType.DTOGraph) {
    return `/analytics/graph?${query}`
  }

  return `/analytics/query?${query}`
}

function DdlPanel({
  ddl,
  loading,
  error,
}: {
  ddl?: string
  loading: boolean
  error: unknown
}) {
  if (loading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (error) {
    return <ErrorAlert title="DDL could not be loaded" error={error} />
  }

  if (!ddl) {
    return (
      <p className="text-sm text-muted-foreground">
        The stats service did not return a schema.
      </p>
    )
  }

  return (
    <pre className="max-h-72 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs">
      {ddl}
    </pre>
  )
}

function StatusBadge({ status }: { status: DTOStatsQueryStatus }) {
  const variant =
    status === DTOStatsQueryStatus.DTOError ? "destructive" : "secondary"

  return (
    <Badge variant={variant}>
      {status === DTOStatsQueryStatus.DTOExecuting ? (
        <Loader2 className="size-3 animate-spin" />
      ) : null}
      {status}
    </Badge>
  )
}

function ErrorAlert({ title, error }: { title: string; error: unknown }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{getApiErrorMessage(error)}</AlertDescription>
    </Alert>
  )
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  )
}

function AnalyticsPageSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function formatQueryType(type?: DTOStatsQueryType) {
  if (type === DTOStatsQueryType.DTOChatGptQuery) {
    return "GPT SQL"
  }

  if (type === DTOStatsQueryType.DTOGraph) {
    return "Graph"
  }

  return "SQL"
}

function formatRepeatingSummary(item: DTOStatsQueryResult) {
  const repeatInterval = item.query?.repeat_interval

  if (repeatInterval) {
    const repetitions = item.total_repetitions
      ? ` · ${item.total_repetitions} runs`
      : ""

    return `Every ${formatRepeatInterval(repeatInterval)}${repetitions}`
  }

  if (item.total_repetitions && item.total_repetitions > 1) {
    return `${item.total_repetitions} runs`
  }

  return "-"
}

function formatRepeatInterval(seconds: number) {
  if (seconds >= 60 * 60 * 24 && seconds % (60 * 60 * 24) === 0) {
    return `${seconds / (60 * 60 * 24)}d`
  }

  if (seconds >= 60 * 60 && seconds % (60 * 60) === 0) {
    return `${seconds / (60 * 60)}h`
  }

  if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60}m`
  }

  return `${seconds}s`
}

function getRepeatIntervalUnit(seconds: number): RepeatIntervalUnit {
  if (seconds > 0 && seconds % (60 * 60 * 24) === 0) {
    return "day"
  }

  if (seconds > 0 && seconds % (60 * 60) === 0) {
    return "hour"
  }

  return "minute"
}

function getRepeatUnitSeconds(unit: RepeatIntervalUnit) {
  return repeatIntervalUnits.find((item) => item.value === unit)?.seconds ?? 60
}

function buildChartConfig(keys: string[]): ChartConfig {
  return Object.fromEntries(
    keys.map((key, index) => [
      key,
      {
        label: key,
        color: chartColors[index % chartColors.length],
      },
    ])
  )
}

function getNumericKeys(dataSource: ChartDatum[]) {
  const keys = Object.keys(dataSource[0] ?? {})

  return keys.filter((key) =>
    dataSource.some((row) => typeof row[key] === "number")
  )
}

function parseCsvToChartData(csv: string): ChartDatum[] {
  const rows = parseCsvRows(csv)
  const [headers, ...body] = rows

  if (!headers?.length) {
    return []
  }

  return body
    .filter((row) => row.some(Boolean))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => {
          const value = row[index] ?? ""

          return [
            header || `Column ${index + 1}`,
            isStrictDecimal(value) ? Number(value) : value,
          ]
        })
      )
    )
}

function parseCsvRows(csv: string) {
  const rows: string[][] = []
  let row: string[] = []
  let value = ""
  let inQuotes = false

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index]
    const nextChar = csv[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === "," && !inQuotes) {
      row.push(value)
      value = ""
      continue
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1
      }
      row.push(value)
      rows.push(row)
      row = []
      value = ""
      continue
    }

    value += char
  }

  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }

  return rows
}

function isStrictDecimal(value: string) {
  return /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(value.trim())
}

function formatDuration(value?: number) {
  if (!value) {
    return "-"
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`
  }

  return `${value}ms`
}

function formatUsd(value?: number) {
  if (typeof value !== "number") {
    return "-"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  }).format(value)
}

function formatDate(value?: number) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function getApiErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Try refreshing the page."
}

function getNeededUsd(error: unknown) {
  if (!error || typeof error !== "object" || !("error" in error)) {
    return null
  }

  const payload = (error as { error?: { need_usd?: unknown } }).error

  return typeof payload?.need_usd === "number" ? payload.need_usd : null
}
