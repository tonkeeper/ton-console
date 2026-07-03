import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  Check,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Gift,
  Loader2,
  MoreHorizontal,
  Plus,
  ReceiptText,
  RefreshCw,
  Wallet,
} from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import { DTOBillingTransactionTypeEnum } from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelectedProject } from "@/hooks/use-project"

import { useBillingCsvExport } from "@/utils/billing/billing-export"
import { BillingQrCode } from "./billing-qr-code"
import {
  type BalanceAmount,
  type BillingHistoryItem,
  type BillingSubscription,
  type DepositAddress,
  useApplyPromoCodeMutation,
  useBillingHistoryQuery,
  useBillingSubscriptionsQuery,
  useDepositAddressesQuery,
  useTonRateQuery,
} from "@/utils/billing/billing-queries"

const USDT_DECIMALS = 6
const DEFAULT_HISTORY_PAGE_SIZE = 50
const HISTORY_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

export function BillingPage() {
  const {
    selectedProject,
    selectedProjectId,
    isLoading: isProjectLoading,
  } = useSelectedProject()
  const [historyPageSize, setHistoryPageSize] = useState(
    DEFAULT_HISTORY_PAGE_SIZE
  )
  const [historyPageNumber, setHistoryPageNumber] = useState(1)
  const [historyCursorStack, setHistoryCursorStack] = useState<string[]>([])
  const [currentHistoryCursor, setCurrentHistoryCursor] = useState<
    string | undefined
  >(undefined)
  const billingQuery = useBillingHistoryQuery({
    beforeTx: currentHistoryCursor,
    limit: historyPageSize,
  })
  const latestBillingQuery = useBillingHistoryQuery({
    limit: DEFAULT_HISTORY_PAGE_SIZE,
  })
  const depositAddressesQuery = useDepositAddressesQuery()
  const subscriptionsQuery = useBillingSubscriptionsQuery()
  const tonRateQuery = useTonRateQuery()
  const billingExport = useBillingCsvExport()

  const billingError = billingQuery.error ?? depositAddressesQuery.error
  const billingHistory = billingQuery.data?.history ?? []
  const latestBillingHistory = latestBillingQuery.data?.history ?? []
  const canGoNextHistoryPage = billingHistory.length === historyPageSize
  const canGoPreviousHistoryPage = historyCursorStack.length > 0

  useEffect(() => {
    setHistoryCursorStack([])
    setCurrentHistoryCursor(undefined)
    setHistoryPageNumber(1)
  }, [selectedProjectId])

  if (isProjectLoading) {
    return <BillingPageSkeleton />
  }

  if (!selectedProject) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet />
          </EmptyMedia>
          <EmptyTitle>No project selected</EmptyTitle>
          <EmptyDescription>
            Select or create a project to view balances and billing history.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Balance/Billing"
        description="Balances, deposit addresses, active paid services, and recent project transactions."
        actions={
          <>
            <RefillDialog
              addresses={depositAddressesQuery.data ?? []}
              billingHistory={latestBillingHistory}
              isAddressLoading={depositAddressesQuery.isLoading}
              isAddressError={depositAddressesQuery.isError}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                billingQuery.refetch()
                if (
                  currentHistoryCursor ||
                  historyPageSize !== DEFAULT_HISTORY_PAGE_SIZE
                ) {
                  latestBillingQuery.refetch()
                }
                depositAddressesQuery.refetch()
                subscriptionsQuery.refetch()
              }}
            >
              <RefreshCw />
              Refresh
            </Button>
          </>
        }
      />

      {billingError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Billing data could not be loaded</AlertTitle>
          <AlertDescription>
            {getQueryErrorMessage(billingError)}
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-3">
        <BalancesCard
          usdtBalance={billingQuery.data?.balances.usdt}
          gramBalance={billingQuery.data?.balances.ton}
          isLoading={billingQuery.isLoading}
          tonRate={tonRateQuery.data}
          isTonRateLoading={tonRateQuery.isLoading}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <DepositAddressesCard
          addresses={depositAddressesQuery.data ?? []}
          isLoading={depositAddressesQuery.isLoading}
          isError={depositAddressesQuery.isError}
        />
        <SubscriptionsCard
          subscriptions={subscriptionsQuery.data ?? []}
          isLoading={subscriptionsQuery.isLoading}
          isError={subscriptionsQuery.isError}
        />
      </section>

      <BillingHistoryCard
        history={billingHistory}
        pageNumber={historyPageNumber}
        pageSize={historyPageSize}
        isLoading={billingQuery.isLoading}
        isFetching={billingQuery.isFetching}
        isError={billingQuery.isError}
        canGoNext={canGoNextHistoryPage}
        canGoPrevious={canGoPreviousHistoryPage}
        exportedCount={billingExport.exportedCount}
        isExporting={billingExport.isExporting}
        onExport={billingExport.exportFullHistory}
        onNextPage={() => {
          const lastItemId = billingHistory[billingHistory.length - 1]?.id

          if (!lastItemId) {
            return
          }

          setHistoryCursorStack((currentStack) => [
            ...currentStack,
            currentHistoryCursor ?? "",
          ])
          setCurrentHistoryCursor(lastItemId)
          setHistoryPageNumber((currentPage) => currentPage + 1)
        }}
        onPageSizeChange={(pageSize) => {
          setHistoryPageSize(pageSize)
          setHistoryCursorStack([])
          setCurrentHistoryCursor(undefined)
          setHistoryPageNumber(1)
        }}
        onPreviousPage={() => {
          const previousCursor =
            historyCursorStack[historyCursorStack.length - 1]

          setHistoryCursorStack((currentStack) => currentStack.slice(0, -1))
          setCurrentHistoryCursor(
            previousCursor === "" ? undefined : previousCursor
          )
          setHistoryPageNumber((currentPage) => Math.max(currentPage - 1, 1))
        }}
      />
    </div>
  )
}

function RefillDialog({
  addresses,
  billingHistory,
  isAddressLoading,
  isAddressError,
}: {
  addresses: DepositAddress[]
  billingHistory: BillingHistoryItem[]
  isAddressLoading: boolean
  isAddressError: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [shownRefillIds, setShownRefillIds] = useState<Set<string>>(
    () => new Set()
  )
  const [baselineTransactionId, setBaselineTransactionId] = useState<
    string | null
  >(null)
  const usdtAddress = addresses.find(
    (address) => address.currency === "USDT"
  )?.address

  useEffect(() => {
    if (
      !isOpen ||
      baselineTransactionId === null ||
      billingHistory.length === 0
    ) {
      return
    }

    const baselineIndex =
      baselineTransactionId === ""
        ? billingHistory.length
        : billingHistory.findIndex((item) => item.id === baselineTransactionId)

    if (baselineIndex === -1) {
      return
    }

    const newRefills = billingHistory
      .slice(0, baselineIndex)
      .filter(
        (item) =>
          item.type === DTOBillingTransactionTypeEnum.DTODeposit &&
          !shownRefillIds.has(item.id)
      )

    if (newRefills.length === 0) {
      return
    }

    newRefills.forEach((item) => {
      toast.success("Refill detected", {
        description: `${formatCryptoAmount(item.amount, item.currency)} received at ${formatTime(item.createdAt)}`,
      })
    })

    setShownRefillIds(
      (currentIds) =>
        new Set([...currentIds, ...newRefills.map((item) => item.id)])
    )
  }, [baselineTransactionId, billingHistory, isOpen, shownRefillIds])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          setBaselineTransactionId(billingHistory[0]?.id ?? "")
          setShownRefillIds(new Set())
        } else {
          setBaselineTransactionId(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Refill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Balance refill</DialogTitle>
          <DialogDescription>
            Add funds with USDT or activate a project promo code.
          </DialogDescription>
        </DialogHeader>
        {isAddressError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Refill is unavailable</AlertTitle>
            <AlertDescription>
              Deposit addresses could not be loaded. Try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="usdt">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usdt">USDT</TabsTrigger>
              <TabsTrigger value="promo">Promo</TabsTrigger>
            </TabsList>
            <TabsContent value="usdt" className="mt-3">
              <UsdtRefillPanel
                address={usdtAddress}
                isAddressLoading={isAddressLoading}
              />
            </TabsContent>
            <TabsContent value="promo" className="mt-3">
              <PromoCodePanel />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

function UsdtRefillPanel({
  address,
  isAddressLoading,
}: {
  address?: string
  isAddressLoading: boolean
}) {
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)

  const paymentLink = useMemo(() => {
    const jettonAddress = import.meta.env.VITE_USDT_JETTON_ADDRESS

    if (!address || !jettonAddress || !isPositiveAmount(amount)) {
      return null
    }

    return createTransferLink(address, {
      amount: toAtomicAmount(amount, USDT_DECIMALS).toString(),
      jetton: jettonAddress,
      text: "TON Console: Refill",
    })
  }, [address, amount])

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const isPaymentUnavailable =
    !import.meta.env.VITE_USDT_JETTON_ADDRESS || (!isAddressLoading && !address)

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="refill-amount">
          Amount
        </label>
        <InputGroup className="h-10">
          <InputGroupInput
            id="refill-amount"
            inputMode="decimal"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => setAmount(cleanAmount(event.target.value))}
            disabled={isAddressLoading || isPaymentUnavailable}
          />
          <InputGroupAddon align="inline-end">USDT</InputGroupAddon>
        </InputGroup>
      </div>

      {isPaymentUnavailable ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>USDT refill is unavailable</AlertTitle>
          <AlertDescription>
            The project address or USDT jetton configuration is missing.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-3 rounded-lg border p-3">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Payment link</p>
            <p className="text-sm text-muted-foreground">
              Enter an amount, then scan the QR code or open the link in a TON
              wallet.
            </p>
          </div>
          {paymentLink ? (
            <BillingQrCode
              value={paymentLink}
              onClick={() =>
                window.open(paymentLink, "_blank", "noopener,noreferrer")
              }
            />
          ) : null}
          <code className="min-h-10 truncate rounded bg-muted px-3 py-2 text-xs">
            {isAddressLoading
              ? "Loading deposit address..."
              : (paymentLink ?? "Payment link will appear here")}
          </code>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={!paymentLink}
              onClick={() => {
                if (paymentLink) {
                  window.open(paymentLink, "_blank", "noopener,noreferrer")
                }
              }}
            >
              <ExternalLink />
              Open wallet
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!paymentLink}
              onClick={() => {
                if (!paymentLink) {
                  return
                }
                copyToClipboard(paymentLink)
                setCopied(true)
              }}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PromoCodePanel() {
  const [promoCode, setPromoCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const promoCodeMutation = useApplyPromoCodeMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedCode = promoCode.trim()
    if (!trimmedCode) {
      setError("Enter a promo code.")
      return
    }

    promoCodeMutation.mutate(trimmedCode, {
      onSuccess: () => {
        setPromoCode("")
        setError(null)
        toast.success("Promo code applied")
      },
      onError: (mutationError) => {
        setError(getQueryErrorMessage(mutationError) || "Invalid promo code.")
      },
    })
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="promo-code">
          Promo code
        </label>
        <Input
          id="promo-code"
          placeholder="Promo Code"
          value={promoCode}
          maxLength={30}
          disabled={promoCodeMutation.isPending}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            setPromoCode(event.target.value)
            setError(null)
          }}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
      <DialogFooter className="mx-0 mb-0 rounded-lg border bg-muted/50">
        <Button
          type="submit"
          disabled={promoCodeMutation.isPending || !promoCode.trim()}
        >
          {promoCodeMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Gift />
          )}
          Apply promo
        </Button>
      </DialogFooter>
    </form>
  )
}

function BalancesCard({
  usdtBalance,
  gramBalance,
  isLoading,
  tonRate,
  isTonRateLoading,
}: {
  usdtBalance?: BalanceAmount
  gramBalance?: BalanceAmount
  isLoading: boolean
  tonRate?: number | null
  isTonRateLoading: boolean
}) {
  const hasGramBalance = Boolean(
    gramBalance &&
      (gramBalance.amount !== 0 ||
        gramBalance.promoAmount !== 0 ||
        gramBalance.total !== 0)
  )
  const rows = [
    {
      label: "USDT",
      currency: "USDT" as const,
      balance: usdtBalance,
      usdRate: 1,
    },
    {
      label: "GRAM",
      currency: "TON" as const,
      balance: gramBalance,
      usdRate: tonRate ?? null,
    },
  ].filter((row) => row.currency !== "TON" || hasGramBalance)
  const totalUsdBalance =
    (usdtBalance?.total ?? 0) + (gramBalance?.total ?? 0) * (tonRate ?? 0)
  const showBalanceSkeleton = isLoading || (hasGramBalance && isTonRateLoading)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(10rem,auto)_minmax(0,1fr)] lg:items-center lg:gap-8">
          <div className="grid gap-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Total
            </span>
            {showBalanceSkeleton ? (
              <Skeleton className="h-10 w-36" />
            ) : (
              <span className="text-3xl font-semibold">
                {formatUsd(totalUsdBalance)}
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-4">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-4 border-t pt-3 first:border-t-0 first:pt-0 sm:grid-cols-2 sm:border-t-0 sm:pt-0"
              >
                <BalanceMetric
                  label="Available"
                  value={
                    isLoading
                      ? null
                      : (
                          <BalanceEquivalentText
                            value={row.balance?.amount ?? 0}
                            currency={row.currency}
                            usdRate={row.usdRate}
                          />
                        )
                  }
                />
                <BalanceMetric
                  label="Promo"
                  value={
                    isLoading
                      ? null
                      : (
                          <BalanceEquivalentText
                            value={row.balance?.promoAmount ?? 0}
                            currency={row.currency}
                            usdRate={row.usdRate}
                          />
                        )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BalanceMetric({
  label,
  value,
}: {
  label: string
  value: ReactNode | null
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </span>
      {value === null ? (
        <Skeleton className="h-5 w-24" />
      ) : (
        <span className="font-semibold">{value}</span>
      )}
    </div>
  )
}

function BalanceEquivalentText({
  value,
  currency,
  usdRate,
  className,
}: {
  value: number
  currency: "USDT" | "TON"
  usdRate: number | null
  className?: string
}) {
  const showUsdEquivalent = usdRate !== null && value !== 0

  return (
    <span className={className}>
      <span>{formatBalanceCryptoAmount(value, currency)}</span>
      {showUsdEquivalent ? (
        <span className="text-muted-foreground">
          {" "}
          ≈ {formatUsd(value * usdRate)}
        </span>
      ) : null}
    </span>
  )
}

function DepositAddressesCard({
  addresses,
  isLoading,
  isError,
}: {
  addresses: DepositAddress[]
  isLoading: boolean
  isError: boolean
}) {
  const visibleAddresses = addresses.filter(
    (address) => address.currency !== "TON"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit addresses</CardTitle>
        <CardDescription>
          Use USDT to refill this project balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <AddressSkeleton /> : null}
        {isError ? (
          <InlineError message="Deposit addresses are unavailable." />
        ) : null}
        {!isLoading && !isError && visibleAddresses.length === 0 ? (
          <Empty className="min-h-48">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Wallet />
              </EmptyMedia>
              <EmptyTitle>No deposit addresses</EmptyTitle>
              <EmptyDescription>
                Deposit addresses have not been issued for this project.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {visibleAddresses.length > 0 ? (
          <div className="grid gap-2">
            {visibleAddresses.map((address) => (
              <DepositAddressRow key={address.currency} address={address} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function DepositAddressRow({ address }: { address: DepositAddress }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border p-3">
      <Badge variant="secondary">{formatCurrencyLabel(address.currency)}</Badge>
      <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1 text-xs">
        {address.address}
      </code>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label={`Copy ${formatCurrencyLabel(address.currency)} deposit address`}
        onClick={() => {
          copyToClipboard(address.address)
          setCopied(true)
        }}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}

function SubscriptionsCard({
  subscriptions,
  isLoading,
  isError,
}: {
  subscriptions: BillingSubscription[]
  isLoading: boolean
  isError: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active service tiers</CardTitle>
        <CardDescription>
          Current project service tiers that can affect billing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <SubscriptionSkeleton /> : null}
        {isError ? (
          <InlineError message="Service tiers are unavailable." />
        ) : null}
        {!isLoading && !isError && subscriptions.length === 0 ? (
          <Empty className="min-h-48">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CreditCard />
              </EmptyMedia>
              <EmptyTitle>No active service tiers</EmptyTitle>
              <EmptyDescription>
                Service tiers will appear here after they are selected.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {subscriptions.length > 0 ? (
          <div className="grid gap-3">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex min-w-0 items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{subscription.service}</p>
                    <Badge variant="outline">{subscription.meta}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subscription.plan} · {subscription.interval}
                    {subscription.renewsAt
                      ? ` · Renews ${formatDate(subscription.renewsAt)}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="text-sm font-semibold">
                    {formatUsd(subscription.price)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Open ${subscription.service} plan actions`}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={subscription.changePlanHref}>
                          <ExternalLink />
                          Change plan
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function BillingHistoryCard({
  history,
  pageNumber,
  pageSize,
  isLoading,
  isFetching,
  isError,
  canGoNext,
  canGoPrevious,
  exportedCount,
  isExporting,
  onExport,
  onNextPage,
  onPageSizeChange,
  onPreviousPage,
}: {
  history: BillingHistoryItem[]
  pageNumber: number
  pageSize: number
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  canGoNext: boolean
  canGoPrevious: boolean
  exportedCount: number
  isExporting: boolean
  onExport: () => void
  onNextPage: () => void
  onPageSizeChange: (pageSize: number) => void
  onPreviousPage: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing history</CardTitle>
        <CardDescription>
          Recent deposits and service charges for the selected project.
        </CardDescription>
        <CardAction className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isExporting}
            onClick={onExport}
          >
            {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
            {isExporting ? `Exporting ${exportedCount}` : "Download CSV"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? <HistorySkeleton /> : null}
        {isError ? (
          <InlineError message="Billing history is unavailable." />
        ) : null}
        {!isLoading && !isError && history.length === 0 ? (
          <Empty className="min-h-64">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ReceiptText />
              </EmptyMedia>
              <EmptyTitle>No billing history yet</EmptyTitle>
              <EmptyDescription>
                Deposits and charges will appear here once activity starts.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {history.length > 0 ? <BillingHistoryTable history={history} /> : null}
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Select
          value={String(pageSize)}
          disabled={isFetching}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger size="sm" aria-label="Billing history rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HISTORY_PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination className="mx-0 w-full min-w-0 justify-start sm:w-auto sm:justify-end">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!canGoPrevious || isFetching}
                className={
                  !canGoPrevious || isFetching
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={(event) => {
                  event.preventDefault()
                  if (canGoPrevious && !isFetching) {
                    onPreviousPage()
                  }
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive aria-current="page">
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!canGoNext || isFetching}
                className={
                  !canGoNext || isFetching ? "pointer-events-none opacity-50" : ""
                }
                onClick={(event) => {
                  event.preventDefault()
                  if (canGoNext && !isFetching) {
                    onNextPage()
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}

function BillingHistoryTable({ history }: { history: BillingHistoryItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id} className="hover:bg-transparent">
              <TableCell className="max-w-[360px]">
                <div className="truncate font-medium">{item.description}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {item.id}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.type === DTOBillingTransactionTypeEnum.DTODeposit
                      ? "secondary"
                      : "outline"
                  }
                >
                  {item.type === DTOBillingTransactionTypeEnum.DTODeposit
                    ? "Deposit"
                    : "Charge"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {formatSignedAmount(item)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDateTime(item.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function InlineError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Unable to load</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

function BillingPageSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <section className="grid gap-3 lg:grid-cols-3">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </section>
      <Skeleton className="h-80" />
    </div>
  )
}

function AddressSkeleton() {
  return (
    <div className="grid gap-2">
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
    </div>
  )
}

function SubscriptionSkeleton() {
  return (
    <div className="grid gap-3">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  )
}

function HistorySkeleton() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12" />
      ))}
    </div>
  )
}

function formatCryptoAmount(value: number, currency: "USDT" | "TON") {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: currency === "USDT" ? 6 : 9,
  }).format(value)} ${formatCurrencyLabel(currency)}`
}

function formatBalanceCryptoAmount(value: number, currency: "USDT" | "TON") {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${formatCurrencyLabel(currency)}`
}

function formatCurrencyLabel(currency: "USDT" | "TON") {
  return currency === "TON" ? "GRAM" : currency
}

function formatSignedAmount(item: BillingHistoryItem) {
  const sign =
    item.type === DTOBillingTransactionTypeEnum.DTODeposit ? "+" : "-"

  return `${sign}${formatCryptoAmount(item.amount, item.currency)}`
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function formatDateTime(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date)
}

function formatTime(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date)
}

function getQueryErrorMessage(error: unknown) {
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

function cleanAmount(value: string) {
  const normalized = value.replace(/[^\d.]/g, "")
  const [whole = "", ...fractionParts] = normalized.split(".")
  const fraction = fractionParts.join("").slice(0, USDT_DECIMALS)

  if (normalized.includes(".")) {
    return `${whole}.${fraction}`
  }

  return whole
}

function isPositiveAmount(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0
}

function toAtomicAmount(value: string, decimals: number) {
  const [whole = "0", fraction = ""] = value.split(".")
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals)

  return (
    BigInt(whole || "0") * 10n ** BigInt(decimals) +
    BigInt(paddedFraction || "0")
  )
}

function createTransferLink(
  address: string,
  options: { amount: string; jetton: string; text: string }
) {
  const link = new URL(`ton://transfer/${address}`)

  link.searchParams.set("jetton", options.jetton)
  link.searchParams.set("amount", options.amount)
  link.searchParams.set("text", options.text)

  return link.toString()
}
