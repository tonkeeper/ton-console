import { useState, type KeyboardEvent, type ReactNode } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  Copy,
  ExternalLink,
  CircleDollarSign,
  MoreHorizontal,
} from "lucide-react"

import {
  DTOGetInvoicesParamsTypeOrderEnum,
  DTOInvoiceFieldOrder,
  DTOInvoiceStatus,
  type DTOInvoicesInvoice,
} from "@/api/api.generated"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  canCancelInvoice,
  formatDateTime,
  formatInvoiceCurrency,
  formatInvoiceAmount,
  getInvoiceStatusLabel,
} from "@/utils/invoices/invoice-format"
import { CancelInvoiceDialog, ViewInvoiceDialog } from "./invoice-dialogs"
import type { InvoicesListSort } from "@/utils/invoices/invoice-types"

type InvoicesTableProps = {
  appId: number | null | undefined
  invoices: DTOInvoicesInvoice[]
  sort: InvoicesListSort
  onSortChange: (sort: InvoicesListSort) => void
}

type ActiveDialog =
  | { type: "view"; invoice: DTOInvoicesInvoice }
  | { type: "cancel"; invoice: DTOInvoicesInvoice }
  | null

export function InvoicesTable({
  appId,
  invoices,
  sort,
  onSortChange,
}: InvoicesTableProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)
  const openInvoice = (invoice: DTOInvoicesInvoice) => {
    setActiveDialog({ type: "view", invoice })
  }
  const toggleSort = (field: DTOInvoiceFieldOrder) => {
    onSortChange({
      field,
      direction:
        sort.field === field &&
        sort.direction === DTOGetInvoicesParamsTypeOrderEnum.DTODesc
          ? DTOGetInvoicesParamsTypeOrderEnum.DTOAsc
          : DTOGetInvoicesParamsTypeOrderEnum.DTODesc,
    })
  }

  return (
    <>
      <div className="max-w-full overflow-x-auto rounded-lg border">
        <Table className="min-w-[760px]">
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              <SortableTableHead
                field={DTOInvoiceFieldOrder.DTOId}
                sort={sort}
                onSort={toggleSort}
              >
                ID
              </SortableTableHead>
              <SortableTableHead
                field={DTOInvoiceFieldOrder.DTOStatus}
                sort={sort}
                onSort={toggleSort}
                className="min-w-[150px]"
              >
                Status
              </SortableTableHead>
              <SortableTableHead
                field={DTOInvoiceFieldOrder.DTOAmount}
                sort={sort}
                onSort={toggleSort}
                className="min-w-[220px]"
              >
                Amount
              </SortableTableHead>
              <SortableTableHead
                field={DTOInvoiceFieldOrder.DTODateCreate}
                sort={sort}
                onSort={toggleSort}
                className="min-w-[260px]"
              >
                Created
              </SortableTableHead>
              <SortableTableHead
                field={DTOInvoiceFieldOrder.DTODescription}
                sort={sort}
                onSort={toggleSort}
              >
                Description
              </SortableTableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => openInvoice(invoice)}
                onKeyDown={(event) => {
                  if (isOpenInvoiceKey(event)) {
                    event.preventDefault()
                    openInvoice(invoice)
                  }
                }}
              >
                <TableCell className="min-w-[160px] font-medium">
                  {invoice.id}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <InvoiceStatusCell invoice={invoice} />
                </TableCell>
                <TableCell className="min-w-[220px] font-medium">
                  <div className="grid gap-1">
                    <span>
                      {formatInvoiceAmount(invoice.amount, invoice.currency)}{" "}
                      {formatInvoiceCurrency(invoice.currency)}
                    </span>
                    {invoice.overpayment ? (
                      <Badge className="w-fit">
                        <CircleDollarSign />+
                        {formatInvoiceAmount(
                          invoice.overpayment,
                          invoice.currency
                        )}{" "}
                        {formatInvoiceCurrency(invoice.currency)}
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="min-w-[260px] text-muted-foreground">
                  {formatDateTime(invoice.date_create)}
                </TableCell>
                <TableCell className="min-w-[240px] text-muted-foreground">
                  <InvoiceDescription description={invoice.description} />
                </TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Open invoice actions"
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => openInvoice(invoice)}
                      >
                        <ExternalLink />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(invoice.id)}
                      >
                        <Copy />
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(invoice.payment_link)}
                      >
                        <Copy />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={!canCancelInvoice(invoice)}
                        onClick={() =>
                          setActiveDialog({ type: "cancel", invoice })
                        }
                      >
                        <Ban />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewInvoiceDialog
        appId={appId}
        open={activeDialog?.type === "view"}
        invoiceId={
          activeDialog?.type === "view" ? activeDialog.invoice.id : null
        }
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
      <CancelInvoiceDialog
        appId={appId}
        open={activeDialog?.type === "cancel"}
        invoice={
          activeDialog?.type === "cancel" ? activeDialog.invoice : undefined
        }
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
    </>
  )
}

function isOpenInvoiceKey(event: KeyboardEvent<HTMLTableRowElement>) {
  return event.key === "Enter" || event.key === " "
}

function SortableTableHead({
  field,
  sort,
  onSort,
  children,
  className,
}: {
  field: DTOInvoiceFieldOrder
  sort: InvoicesListSort
  onSort: (field: DTOInvoiceFieldOrder) => void
  children: ReactNode
  className?: string
}) {
  const active = sort.field === field
  const Icon = active
    ? sort.direction === DTOGetInvoicesParamsTypeOrderEnum.DTODesc
      ? ArrowDown
      : ArrowUp
    : ArrowUpDown

  return (
    <TableHead className={className}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 px-2"
        onClick={() => onSort(field)}
      >
        {children}
        <Icon className={active ? "" : "text-muted-foreground"} />
      </Button>
    </TableHead>
  )
}

function InvoiceStatusBadge({ status }: { status: DTOInvoiceStatus }) {
  const variant =
    status === DTOInvoiceStatus.DTOPaid
      ? "default"
      : status === DTOInvoiceStatus.DTOExpired
        ? "destructive"
      : status === DTOInvoiceStatus.DTOPending
        ? "secondary"
        : "outline"

  return (
    <Badge variant={variant}>
      {getInvoiceStatusLabel(status)}
    </Badge>
  )
}

function InvoiceStatusCell({ invoice }: { invoice: DTOInvoicesInvoice }) {
  return <InvoiceStatusBadge status={invoice.status} />
}

function InvoiceDescription({
  description,
}: {
  description?: string | null
}) {
  const trimmed = description?.trim() ?? ""

  if (!trimmed) {
    return null
  }

  const display =
    trimmed.length > 30 ? `${trimmed.slice(0, 30).trimEnd()}...` : trimmed

  if (trimmed.length <= 30) {
    return <span>{display}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block max-w-[240px] cursor-help truncate">
          {display}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm whitespace-normal">
        {trimmed}
      </TooltipContent>
    </Tooltip>
  )
}
