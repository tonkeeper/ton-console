import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Navigate, useLocation } from "react-router"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  CalendarDays,
  Check,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileCode2,
  KeyRound,
  Loader2,
  Plus,
  ReceiptText,
  RefreshCcw,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

import {
  DTOCryptoCurrency,
  DTOGetInvoicesParamsTypeOrderEnum,
  DTOInvoiceFieldOrder,
  DTOInvoiceStatus,
  DTOProjectCapabilitiesEnum,
  type DTOProject,
  type DTOInvoicesApp,
} from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelectedProject } from "@/hooks/use-project"

import { FeedbackDialog } from "@/fragments/feedback/feedback-dialog"
import { CreateInvoiceDialog } from "./invoice-dialogs"
import {
  formatAddress,
  formatDateTime,
  formatInvoiceCurrency,
  formatInvoiceAmount,
  formatTonAddressNonBounceable,
  getInvoiceErrorMessage,
} from "@/utils/invoices/invoice-format"
import {
  useCreateInvoicesAppMutation,
  useExportInvoicesCsvMutation,
  useFilteredInvoicesListQuery,
  useInvoicesAppQuery,
  useInvoicesStatsQuery,
  useInvoicesTokenQuery,
  useRegenerateInvoicesTokenMutation,
  useUpdateInvoicesAppMutation,
} from "@/utils/invoices/invoice-queries"
import type {
  InvoicesAppErrors,
  InvoicesAppValues,
  InvoicesListFilters,
  InvoicesListPagination,
  InvoicesListSort,
} from "@/utils/invoices/invoice-types"
import {
  InvoicesAppForm,
  getInvoicesAppDefaultValues,
  validateInvoicesApp,
} from "./invoices-app-form"
import { InvoicesTable } from "./invoices-table"
import { InvoicesWebhooks } from "./invoices-webhooks"

type InvoicesSection = "dashboard" | "manage" | "index" | "unknown"

const defaultFilters: InvoicesListFilters = {
  searchId: "",
  status: "all",
  currency: "all",
  period: null,
  overpayment: false,
}

const defaultSort: InvoicesListSort = {
  field: DTOInvoiceFieldOrder.DTODateCreate,
  direction: DTOGetInvoicesParamsTypeOrderEnum.DTODesc,
}

const defaultPagination: InvoicesListPagination = {
  page: 1,
  pageSize: 30,
}

const INVOICES_DOCS_URL = "https://docs.tonconsole.com/tonconsole/invoices"

export function InvoicesPage() {
  const location = useLocation()
  const section = getInvoicesSection(location.pathname)
  const projectQuery = useSelectedProject()
  const project = projectQuery.selectedProject
  const hasInvoicesCapability =
    project?.capabilities.includes(DTOProjectCapabilitiesEnum.DTOInvoices) ??
    false
  const appQuery = useInvoicesAppQuery(hasInvoicesCapability)
  const app = appQuery.data
  const [createAppOpen, setCreateAppOpen] = useState(false)

  if (projectQuery.isLoading) {
    return <InvoicesPageSkeleton />
  }

  if (!project) {
    return (
      <Empty className="min-h-[calc(100svh-8rem)] border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptText />
          </EmptyMedia>
          <EmptyTitle>Select a project</EmptyTitle>
          <EmptyDescription>
            Invoices are configured inside a project workspace.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (section === "unknown") {
    return <Navigate to="/invoices" replace />
  }

  if (!hasInvoicesCapability && section !== "index") {
    return <Navigate to="/invoices" replace />
  }

  if (
    hasInvoicesCapability &&
    appQuery.isSuccess &&
    app &&
    section === "index"
  ) {
    return <Navigate to="/invoices/dashboard" replace />
  }

  if (
    hasInvoicesCapability &&
    appQuery.isSuccess &&
    !app &&
    section !== "index"
  ) {
    return <Navigate to="/invoices" replace />
  }

  return (
    <div className="grid gap-5">
      {section !== "manage" ? (
        <PageHeader
          title="Invoices"
          description="Register a project invoices app, issue invoices, and monitor payment state."
        />
      ) : null}

      {!hasInvoicesCapability ? <UnavailableInvoices project={project} /> : null}

      {hasInvoicesCapability && appQuery.isLoading ? (
        <InvoicesPageSkeleton />
      ) : null}

      {appQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Could not load invoices app</AlertTitle>
          <AlertDescription>
            {getInvoiceErrorMessage(appQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {hasInvoicesCapability && appQuery.isSuccess && !app ? (
        <RegisterInvoicesAppCard onCreate={() => setCreateAppOpen(true)} />
      ) : null}

      {app ? (
        <>
          {section === "manage" ? (
            <ManageSection app={app} />
          ) : (
            <DashboardSection app={app} />
          )}
        </>
      ) : null}

      <CreateInvoicesAppDialog
        open={createAppOpen}
        onOpenChange={setCreateAppOpen}
      />
    </div>
  )
}

function UnavailableInvoices({ project }: { project: DTOProject }) {
  return (
    <EmptyState
      className="min-h-96"
      icon={<ReceiptText />}
      title="Invoices unavailable"
      description="Invoices are not enabled for this project yet. Send a request and the team will help enable them."
      actions={
        <>
          <Button asChild variant="outline">
            <a href={INVOICES_DOCS_URL} target="_blank" rel="noreferrer">
              <ExternalLink />
              Read Guide
            </a>
          </Button>
          <FeedbackDialog
            source="invoices-request"
            project={project}
            trigger={
              <Button type="button">
                <ReceiptText />
                Request
              </Button>
            }
          />
        </>
      }
    />
  )
}

function getInvoicesSection(pathname: string): InvoicesSection {
  const normalized = pathname.replace(/\/+$/, "")

  if (normalized === "/invoices") {
    return "index"
  }

  if (normalized === "/invoices/dashboard") {
    return "dashboard"
  }

  if (normalized === "/invoices/manage") {
    return "manage"
  }

  return "unknown"
}

function RegisterInvoicesAppCard({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      className="min-h-96"
      icon={<Settings2 />}
      title="Create an invoices app"
      description="Add a recipient address before issuing invoices for this project."
      actions={
        <Button type="button" onClick={onCreate}>
          <Plus />
          Create app
        </Button>
      }
    />
  )
}

function DashboardSection({ app }: { app: DTOInvoicesApp }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <AppCard app={app} />
        <TokenCard appId={app.id} />
      </section>

      <StatsSection appId={app.id} />

      <InvoicesWebhooks appId={app.id} webhooks={app.webhooks} />

      <DeveloperDocsSection />
    </div>
  )
}

function ManageSection({ app }: { app: DTOInvoicesApp }) {
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false)
  const [filters, setFilters] = useState<InvoicesListFilters>(defaultFilters)
  const [sort, setSort] = useState<InvoicesListSort>(defaultSort)
  const [pagination, setPagination] =
    useState<InvoicesListPagination>(defaultPagination)
  const invoicesQuery = useFilteredInvoicesListQuery(
    app.id,
    filters,
    sort,
    pagination
  )
  const exportCsv = useExportInvoicesCsvMutation(app.id, filters, sort)
  const hasActiveFilters = useMemo(
    () =>
      Boolean(filters.searchId.trim()) ||
      filters.status !== "all" ||
      filters.currency !== "all" ||
      filters.period !== null ||
      filters.overpayment,
    [filters]
  )
  const invoiceCount = invoicesQuery.data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(invoiceCount / pagination.pageSize))

  useEffect(() => {
    setPagination((current) => ({ ...current, page: 1 }))
  }, [filters, sort])

  useEffect(() => {
    if (pagination.page > totalPages) {
      setPagination((current) => ({ ...current, page: totalPages }))
    }
  }, [pagination.page, totalPages])

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Manage invoices"
        description={`${app.name} · recipient ${formatAddress(app.recipient_address)}`}
        actions={
          <Button type="button" onClick={() => setCreateInvoiceOpen(true)}>
            <Plus />
            Create invoice
          </Button>
        }
      />

      <Card className="min-w-0">
        <CardHeader className="has-data-[slot=card-action]:grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            {invoiceCount > 0
              ? `Showing page ${pagination.page} of ${totalPages} for ${invoiceCount} invoices.`
              : "Search, filter, and sort invoices for this app."}
          </CardDescription>
          <CardAction className="col-start-1 row-start-3 row-span-1 justify-self-start sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:justify-self-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={exportCsv.isPending}
                onClick={() =>
                  exportCsv.mutate(undefined, {
                    onSuccess: (file) => {
                      downloadBlob(
                        file,
                        `invoices-${new Date().toISOString().slice(0, 10)}.csv`
                      )
                    },
                  })
                }
              >
                {exportCsv.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download />
                )}
                Export CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={invoicesQuery.isFetching}
                onClick={() => invoicesQuery.refetch()}
              >
                {invoicesQuery.isFetching ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                Refresh
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-4">
          <InvoicesFilters
            filters={filters}
            sort={sort}
            pagination={pagination}
            hasActiveFilters={hasActiveFilters}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onPaginationChange={setPagination}
            onClear={() => {
              setFilters(defaultFilters)
              setSort(defaultSort)
            }}
          />

          {exportCsv.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not export invoices</AlertTitle>
              <AlertDescription>
                {getInvoiceErrorMessage(exportCsv.error)}
              </AlertDescription>
            </Alert>
          ) : null}
          {invoicesQuery.isLoading ? (
            <div className="grid gap-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-48" />
            </div>
          ) : null}
          {invoicesQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not load invoices</AlertTitle>
              <AlertDescription>
                {getInvoiceErrorMessage(invoicesQuery.error)}
              </AlertDescription>
            </Alert>
          ) : null}
          {invoicesQuery.isSuccess && invoicesQuery.data.items.length === 0 ? (
            <Empty className="min-h-72">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ReceiptText />
                </EmptyMedia>
                <EmptyTitle>No invoices found</EmptyTitle>
                <EmptyDescription>
                  {hasActiveFilters
                    ? "Adjust filters or create a new payment link."
                    : "Create the first payment link for this app."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setCreateInvoiceOpen(true)}>
                  <Plus />
                  Create invoice
                </Button>
              </EmptyContent>
            </Empty>
          ) : null}
          {invoicesQuery.isSuccess && invoicesQuery.data.items.length > 0 ? (
            <div className="grid min-w-0 gap-4">
              <InvoicesTable
                appId={app.id}
                invoices={invoicesQuery.data.items}
                sort={sort}
                onSortChange={setSort}
              />
              <InvoicesPagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalCount={invoiceCount}
                disabled={invoicesQuery.isFetching}
                onPageChange={(page) =>
                  setPagination((current) => ({ ...current, page }))
                }
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <CreateInvoiceDialog
        appId={app.id}
        open={createInvoiceOpen}
        onOpenChange={setCreateInvoiceOpen}
      />
    </div>
  )
}

function InvoicesFilters({
  filters,
  sort,
  pagination,
  hasActiveFilters,
  onFiltersChange,
  onSortChange,
  onPaginationChange,
  onClear,
}: {
  filters: InvoicesListFilters
  sort: InvoicesListSort
  pagination: InvoicesListPagination
  hasActiveFilters: boolean
  onFiltersChange: (filters: InvoicesListFilters) => void
  onSortChange: (sort: InvoicesListSort) => void
  onPaginationChange: (pagination: InvoicesListPagination) => void
  onClear: () => void
}) {
  const [searchValue, setSearchValue] = useState(filters.searchId)

  useEffect(() => {
    setSearchValue(filters.searchId)
  }, [filters.searchId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchValue !== filters.searchId) {
        onFiltersChange({ ...filters, searchId: searchValue })
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [filters, onFiltersChange, searchValue])

  const selectContentClassName =
    "!w-[var(--radix-select-trigger-width)] !min-w-[var(--radix-select-trigger-width)]"

  return (
    <div className="flex min-w-0 flex-wrap items-end gap-3">
      <label className="grid min-w-0 gap-2 text-sm">
        <span className="font-medium">Invoice ID</span>
        <div className="relative w-fit">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-auto pr-8 pl-9"
            value={searchValue}
            placeholder="Search by invoice ID"
            onChange={(event) =>
              setSearchValue(event.target.value.replace(/[^a-zA-Z0-9]/g, ""))
            }
          />
          {searchValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-1 right-1"
              aria-label="Clear invoice ID search"
              onClick={() => {
                setSearchValue("")
                onFiltersChange({ ...filters, searchId: "" })
              }}
            >
              <X />
            </Button>
          ) : null}
        </div>
      </label>

      <label className="grid min-w-0 gap-2 text-sm">
        <span className="font-medium">Status</span>
        <Select
          value={filters.status}
          onValueChange={(status) =>
            onFiltersChange({
              ...filters,
              status: status as InvoicesListFilters["status"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={DTOInvoiceStatus.DTOPending}>Pending</SelectItem>
            <SelectItem value={DTOInvoiceStatus.DTOPaid}>Paid</SelectItem>
            <SelectItem value={DTOInvoiceStatus.DTOCancelled}>
              Cancelled
            </SelectItem>
            <SelectItem value={DTOInvoiceStatus.DTOExpired}>Expired</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <PeriodFilter
        period={filters.period}
        onChange={(period) => onFiltersChange({ ...filters, period })}
      />

      <label className="grid min-w-0 gap-2 text-sm">
        <span className="font-medium">Currency</span>
        <Select
          value={filters.currency}
          onValueChange={(currency) =>
            onFiltersChange({
              ...filters,
              currency: currency as InvoicesListFilters["currency"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            <SelectItem value="all">All currencies</SelectItem>
            <SelectItem value={DTOCryptoCurrency.DTO_TON}>
              {formatInvoiceCurrency(DTOCryptoCurrency.DTO_TON)}
            </SelectItem>
            <SelectItem value={DTOCryptoCurrency.DTO_USDT}>USDT</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <label className="grid min-w-0 gap-2 text-sm">
        <span className="font-medium">Sort</span>
        <Select
          value={`${sort.field}:${sort.direction}`}
          onValueChange={(value) => {
            const [field, direction] = value.split(":")
            onSortChange({
              field: field as DTOInvoiceFieldOrder,
              direction: direction as DTOGetInvoicesParamsTypeOrderEnum,
            })
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            <SelectItem
              value={`${DTOInvoiceFieldOrder.DTODateCreate}:${DTOGetInvoicesParamsTypeOrderEnum.DTODesc}`}
            >
              Newest
            </SelectItem>
            <SelectItem
              value={`${DTOInvoiceFieldOrder.DTODateCreate}:${DTOGetInvoicesParamsTypeOrderEnum.DTOAsc}`}
            >
              Oldest
            </SelectItem>
            <SelectItem
              value={`${DTOInvoiceFieldOrder.DTOAmount}:${DTOGetInvoicesParamsTypeOrderEnum.DTODesc}`}
            >
              Amount high
            </SelectItem>
            <SelectItem
              value={`${DTOInvoiceFieldOrder.DTOAmount}:${DTOGetInvoicesParamsTypeOrderEnum.DTOAsc}`}
            >
              Amount low
            </SelectItem>
          </SelectContent>
        </Select>
      </label>

      <label className="grid min-w-0 gap-2 text-sm">
        <span className="font-medium">Rows</span>
        <Select
          value={String(pagination.pageSize)}
          onValueChange={(pageSize) =>
            onPaginationChange({ page: 1, pageSize: Number(pageSize) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            <SelectItem value="10">10 rows</SelectItem>
            <SelectItem value="30">30 rows</SelectItem>
            <SelectItem value="50">50 rows</SelectItem>
            <SelectItem value="100">100 rows</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <label className="flex h-8 min-w-0 items-center gap-2 text-sm">
        <Checkbox
          checked={filters.overpayment}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, overpayment: checked === true })
          }
        />
        Overpayment
      </label>

      <Button
        type="button"
        variant="outline"
        className="h-8"
        disabled={!hasActiveFilters}
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  )
}

function PeriodFilter({
  period,
  onChange,
}: {
  period: InvoicesListFilters["period"]
  onChange: (period: InvoicesListFilters["period"]) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedRange: DateRange | undefined = period ?? undefined

  return (
    <label className="grid min-w-0 gap-2 text-sm">
      <span className="font-medium">Period</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="justify-start px-3 font-normal"
          >
            <CalendarDays />
            <span className="truncate">
              {period ? formatPeriod(period) : "Any period"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto gap-3 p-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onChange(getMonthPeriod(new Date()))}
            >
              This month
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onChange(getPreviousMonthPeriod())}
            >
              Previous month
            </Button>
          </div>
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              if (!range?.from) {
                onChange(null)
                return
              }

              onChange({ from: range.from, to: range.to ?? range.from })
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </label>
  )
}

function InvoicesPagination({
  page,
  pageSize,
  totalCount,
  disabled,
  onPageChange,
}: {
  page: number
  pageSize: number
  totalCount: number
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  if (totalCount <= pageSize) {
    return null
  }

  const pages = getVisiblePages(page, totalPages)

  return (
    <div className="flex min-w-0 flex-col gap-3 border-t pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <span>
        Showing {(page - 1) * pageSize + 1}-
        {Math.min(page * pageSize, totalCount)} of {totalCount}
      </span>
      <Pagination className="mx-0 w-full min-w-0 justify-start md:w-auto md:justify-end">
        <PaginationContent className="flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1 || disabled}
              className={
                page === 1 || disabled ? "pointer-events-none opacity-50" : ""
              }
              onClick={(event) => {
                event.preventDefault()
                if (page > 1 && !disabled) {
                  onPageChange(page - 1)
                }
              }}
            />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                aria-disabled={disabled}
                className={disabled ? "pointer-events-none opacity-50" : ""}
                onClick={(event) => {
                  event.preventDefault()
                  if (!disabled) {
                    onPageChange(pageNumber)
                  }
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages || disabled}
              className={
                page === totalPages || disabled
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(event) => {
                event.preventDefault()
                if (page < totalPages && !disabled) {
                  onPageChange(page + 1)
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function getVisiblePages(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 1, totalPages - 2))
  const end = Math.min(totalPages, start + 2)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function downloadBlob(file: Blob, filename: string) {
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function getMonthPeriod(date: Date) {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  }
}

function getPreviousMonthPeriod() {
  const date = new Date()
  return getMonthPeriod(new Date(date.getFullYear(), date.getMonth() - 1, 1))
}

function formatPeriod(period: NonNullable<InvoicesListFilters["period"]>) {
  return `${formatDate(period.from)} - ${formatDate(period.to)}`
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function CreateInvoicesAppDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const formId = useId()
  const createApp = useCreateInvoicesAppMutation()
  const [values, setValues] = useState<InvoicesAppValues>(
    getInvoicesAppDefaultValues()
  )
  const [errors, setErrors] = useState<InvoicesAppErrors>({})
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setValues(getInvoicesAppDefaultValues())
      setErrors({})
      createApp.reset()
    }
    wasOpenRef.current = open
  }, [createApp, open])

  const submit = () => {
    const nextErrors = validateInvoicesApp(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    createApp.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create invoices app</DialogTitle>
          <DialogDescription>
            Register the current project for invoice payments.
          </DialogDescription>
        </DialogHeader>
        <InvoicesAppForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={createApp.isPending}
          onChange={setValues}
          onSubmit={submit}
        />
        {createApp.isError ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(createApp.error)}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={createApp.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={createApp.isPending}>
            {createApp.isPending ? <Loader2 className="animate-spin" /> : null}
            Create app
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditInvoicesAppDialog({
  app,
  open,
  onOpenChange,
}: {
  app: DTOInvoicesApp
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const formId = useId()
  const updateApp = useUpdateInvoicesAppMutation()
  const [values, setValues] = useState<InvoicesAppValues>(() =>
    getInvoicesAppValues(app)
  )
  const [errors, setErrors] = useState<InvoicesAppErrors>({})
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (!wasOpenRef.current && open) {
      setValues(getInvoicesAppValues(app))
      setErrors({})
      updateApp.reset()
    }
    wasOpenRef.current = open
  }, [app, open, updateApp])

  const submit = () => {
    const nextErrors = validateInvoicesApp(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    updateApp.mutate(
      { app, values },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit invoices app</DialogTitle>
          <DialogDescription>
            Update the app name, description, or recipient address.
          </DialogDescription>
        </DialogHeader>
        <InvoicesAppForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={updateApp.isPending}
          onChange={setValues}
          onSubmit={submit}
        />
        {updateApp.isError ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(updateApp.error)}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={updateApp.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={updateApp.isPending}>
            {updateApp.isPending ? <Loader2 className="animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getInvoicesAppValues(app: DTOInvoicesApp): InvoicesAppValues {
  return {
    name: app.name ?? "",
    description: app.description ?? "",
    recipientAddress: app.recipient_address
      ? formatTonAddressNonBounceable(app.recipient_address)
      : "",
  }
}

function AppCard({ app }: { app: DTOInvoicesApp }) {
  const [editOpen, setEditOpen] = useState(false)
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const recipientAddress = formatTonAddressNonBounceable(app.recipient_address)

  useEffect(() => {
    if (!copiedValue) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedValue(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedValue])

  const copyValue = (key: string, value: string) => {
    copyToClipboard(value)
    setCopiedValue(key)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{app.name}</CardTitle>
          <CardDescription>
            {app.description || "Invoices app for this project."}
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <Badge variant="secondary">App ID {app.id}</Badge>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Copy invoices app ID"
              onClick={() => copyValue("app-id", String(app.id))}
            >
              {copiedValue === "app-id" ? <Check /> : <Copy />}
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Edit invoices app"
              onClick={() => setEditOpen(true)}
            >
              <Edit3 />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <InfoRow
            label="Recipient"
            value={
              <span className="flex min-w-0 items-center gap-2">
                <span className="min-w-0 break-all">
                  {formatAddress(recipientAddress)}
                </span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label="Copy invoices recipient address"
                  onClick={() => copyValue("recipient", recipientAddress)}
                >
                  {copiedValue === "recipient" ? <Check /> : <Copy />}
                </Button>
              </span>
            }
          />
          <InfoRow label="Created" value={formatDateTime(app.date_create)} />
        </CardContent>
      </Card>
      <EditInvoicesAppDialog
        app={app}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

function TokenCard({ appId }: { appId: number }) {
  const tokenQuery = useInvoicesTokenQuery(appId)
  const regenerateToken = useRegenerateInvoicesTokenMutation(appId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wasConfirmOpenRef = useRef(confirmOpen)
  const token = tokenQuery.data

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  useEffect(() => {
    if (!wasConfirmOpenRef.current && confirmOpen) {
      regenerateToken.reset()
    }
    wasConfirmOpenRef.current = confirmOpen
  }, [confirmOpen, regenerateToken])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>API token</CardTitle>
          <CardDescription>
            Use this token from a trusted backend service.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {tokenQuery.isLoading ? <Skeleton className="h-10" /> : null}
          {tokenQuery.isError ? (
            <p className="text-sm text-destructive">
              {getInvoiceErrorMessage(tokenQuery.error)}
            </p>
          ) : null}
          {token ? (
            <div className="flex min-w-0 items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-2 text-xs">
                {token}
              </code>
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="Copy invoice token"
                onClick={() => {
                  copyToClipboard(token)
                  setCopied(true)
                }}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={regenerateToken.isPending || tokenQuery.isLoading}
            onClick={() => setConfirmOpen(true)}
          >
            <RefreshCcw />
            Regenerate token
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <KeyRound />
            </AlertDialogMedia>
            <AlertDialogTitle>Regenerate token?</AlertDialogTitle>
            <AlertDialogDescription>
              The previous invoices token will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {regenerateToken.isError ? (
            <p className="text-sm text-destructive">
              {getInvoiceErrorMessage(regenerateToken.error)}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={regenerateToken.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={regenerateToken.isPending}
              onClick={() =>
                regenerateToken.mutate(undefined, {
                  onSuccess: () => setConfirmOpen(false),
                })
              }
            >
              {regenerateToken.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Regenerate
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function StatsSection({ appId }: { appId: number }) {
  const tonStats = useInvoicesStatsQuery(appId, DTOCryptoCurrency.DTO_TON)
  const usdtStats = useInvoicesStatsQuery(appId, DTOCryptoCurrency.DTO_USDT)

  return (
    <section className="grid gap-4">
      <h3 className="font-heading text-xl font-semibold tracking-normal">
        Statistics
      </h3>
      <StatsCurrencyBlock
        currency={DTOCryptoCurrency.DTO_TON}
        stats={tonStats.data}
        isLoading={tonStats.isLoading}
      />
      <StatsCurrencyBlock
        currency={DTOCryptoCurrency.DTO_USDT}
        stats={usdtStats.data}
        isLoading={usdtStats.isLoading}
      />
    </section>
  )
}

function StatsCurrencyBlock({
  currency,
  stats,
  isLoading,
}: {
  currency: DTOCryptoCurrency
  stats:
    | {
        total: number
        success_total: number
        success_in_week: number
        invoices_in_progress: number
        total_amount_pending: number
      }
    | undefined
  isLoading: boolean
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium text-muted-foreground">
        {formatInvoiceCurrency(currency)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          title="Total invoices"
          value={stats?.total}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active invoices"
          value={stats?.invoices_in_progress}
          isLoading={isLoading}
        />
        <StatsCard
          title="Earned total"
          value={
            stats
              ? `${formatInvoiceAmount(stats.success_total, currency)} ${formatInvoiceCurrency(currency)}`
              : undefined
          }
          isLoading={isLoading}
        />
        <StatsCard
          title="Earned last 7 days"
          value={
            stats
              ? `${formatInvoiceAmount(stats.success_in_week, currency)} ${formatInvoiceCurrency(currency)}`
              : undefined
          }
          isLoading={isLoading}
        />
        <StatsCard
          title="Pending payment"
          value={
            stats
              ? `${formatInvoiceAmount(
                  stats.total_amount_pending,
                  currency
                )} ${formatInvoiceCurrency(currency)}`
              : undefined
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

function DeveloperDocsSection() {
  const createInvoiceCurl = `curl -X POST https://tonconsole.com/api/v1/services/invoices/invoice \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer <YOUR_TOKEN>' \\
  -d '{"amount":"1000000000","life_time":1800,"description":"Example description","currency":"TON"}'`
  const getInvoiceCurl = `curl -X GET https://tonconsole.com/api/v1/services/invoices/<INVOICE_ID> \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer <YOUR_TOKEN>'`

  return (
    <section className="grid gap-3 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Authorization
          </CardTitle>
          <CardDescription>
            Use the invoices token as a Bearer token from a trusted backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <CopyCodeBlock text="Authorization: Bearer <YOUR_TOKEN>" />
          <p className="text-muted-foreground">
            Keep the token secret. Regenerate it immediately if it is exposed,
            because the previous token stops working after regeneration.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="size-4" />
            API usage
          </CardTitle>
          <CardDescription>
            Create payment links and fetch invoice state from your server.
          </CardDescription>
          <CardAction>
            <Button asChild type="button" variant="outline" size="sm">
              <a href={INVOICES_DOCS_URL} target="_blank" rel="noreferrer">
                <ExternalLink />
                Docs
              </a>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create">
            <TabsList>
              <TabsTrigger value="create">Create invoice</TabsTrigger>
              <TabsTrigger value="get">Get invoice</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="mt-3 grid gap-3">
              <CopyCodeBlock text={createInvoiceCurl} />
              <ul className="grid gap-1 text-sm text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-1">amount</code> is in
                  nanoGRAM for GRAM and microUSDT for USDT. The API still uses{" "}
                  <code className="rounded bg-muted px-1">TON</code> as the
                  native currency value.
                </li>
                <li>
                  <code className="rounded bg-muted px-1">life_time</code> is
                  invoice validity in seconds.
                </li>
                <li>
                  <code className="rounded bg-muted px-1">description</code> is
                  optional metadata for your team.
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="get" className="mt-3">
              <CopyCodeBlock text={getInvoiceCurl} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}

function CopyCodeBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted/60">
      <pre className="overflow-x-auto p-3 pr-12 text-xs leading-relaxed">
        <code>{text}</code>
      </pre>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="absolute top-2 right-2 bg-background"
        aria-label="Copy code"
        onClick={() => {
          copyToClipboard(text)
          setCopied(true)
        }}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}

function StatsCard({
  title,
  value,
  isLoading,
}: {
  title: string
  value?: string | number
  isLoading: boolean
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        {isLoading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-xl font-semibold">{value ?? "0"}</div>
        )}
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{value}</span>
    </div>
  )
}

function InvoicesPageSkeleton() {
  return (
    <div className="grid gap-5">
      <Skeleton className="h-16" />
      <section className="grid gap-3 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </section>
      <Skeleton className="h-64" />
    </div>
  )
}
