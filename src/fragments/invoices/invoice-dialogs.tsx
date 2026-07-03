import { useEffect, useId, useState, type ReactNode } from "react"
import { Ban, Check, Copy, Loader2, ReceiptText } from "lucide-react"
import copyToClipboard from "copy-to-clipboard"

import type { DTOInvoicesInvoice } from "@/api/api.generated"
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import {
  canCancelInvoice,
  formatAddress,
  formatDateTime,
  formatInvoiceCurrency,
  formatInvoiceAmount,
  getInvoiceErrorMessage,
  getInvoiceStatusMeta,
  getInvoiceStatusLabel,
} from "@/utils/invoices/invoice-format"
import {
  useCancelInvoiceMutation,
  useCreateInvoiceMutation,
  useInvoiceQuery,
} from "@/utils/invoices/invoice-queries"
import {
  CreateInvoiceForm,
  getCreateInvoiceDefaultValues,
  validateCreateInvoice,
} from "./create-invoice-form"
import type {
  CreateInvoiceErrors,
  CreateInvoiceValues,
} from "@/utils/invoices/invoice-types"

type CreateInvoiceDialogProps = {
  appId: number | null | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceDialog({
  appId,
  open,
  onOpenChange,
}: CreateInvoiceDialogProps) {
  const formId = useId()
  const createInvoice = useCreateInvoiceMutation(appId)
  const [createdInvoice, setCreatedInvoice] =
    useState<DTOInvoicesInvoice | null>(null)
  const [values, setValues] = useState<CreateInvoiceValues>(
    getCreateInvoiceDefaultValues()
  )
  const [errors, setErrors] = useState<CreateInvoiceErrors>({})

  useEffect(() => {
    if (!open) {
      setValues(getCreateInvoiceDefaultValues())
      setErrors({})
      setCreatedInvoice(null)
    }
  }, [open])

  const submit = () => {
    const nextErrors = validateCreateInvoice(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    createInvoice.mutate(values, {
      onSuccess: (invoice) => setCreatedInvoice(invoice),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {createdInvoice ? (
          <>
            <DialogHeader>
              <DialogTitle>Invoice created</DialogTitle>
              <DialogDescription>
                Share the payment link with your customer.
              </DialogDescription>
            </DialogHeader>
            <InvoiceDetails invoice={createdInvoice} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => copyToClipboard(createdInvoice.payment_link)}
              >
                <Copy />
                Copy link
              </Button>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create invoice</DialogTitle>
              <DialogDescription>
                Generate a GRAM or USDT payment link for this app.
              </DialogDescription>
            </DialogHeader>
            <CreateInvoiceForm
              formId={formId}
              values={values}
              errors={errors}
              disabled={createInvoice.isPending}
              onChange={setValues}
              onSubmit={submit}
            />
            {createInvoice.isError ? (
              <p className="text-sm text-destructive">
                {getInvoiceErrorMessage(createInvoice.error)}
              </p>
            ) : null}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={createInvoice.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form={formId}
                type="submit"
                disabled={createInvoice.isPending}
              >
                {createInvoice.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Create
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

type ViewInvoiceDialogProps = {
  appId: number | null | undefined
  invoiceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewInvoiceDialog({
  appId,
  invoiceId,
  open,
  onOpenChange,
}: ViewInvoiceDialogProps) {
  const invoiceQuery = useInvoiceQuery(open ? invoiceId : null, appId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice details</DialogTitle>
          <DialogDescription>
            Current payment state and customer-facing link.
          </DialogDescription>
        </DialogHeader>
        {invoiceQuery.isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : null}
        {invoiceQuery.isError ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(invoiceQuery.error)}
          </p>
        ) : null}
        {invoiceQuery.data ? (
          <InvoiceDetails invoice={invoiceQuery.data} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type CancelInvoiceDialogProps = {
  appId: number | null | undefined
  invoice?: DTOInvoicesInvoice
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelInvoiceDialog({
  appId,
  invoice,
  open,
  onOpenChange,
}: CancelInvoiceDialogProps) {
  const cancelInvoice = useCancelInvoiceMutation(appId)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Ban />
          </AlertDialogMedia>
          <AlertDialogTitle>Cancel invoice</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. The payment link for invoice {invoice?.id}{" "}
            will stop accepting payment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {cancelInvoice.isError ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(cancelInvoice.error)}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelInvoice.isPending}>
            Keep invoice
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={
              !invoice || !canCancelInvoice(invoice) || cancelInvoice.isPending
            }
            onClick={() => {
              if (!invoice) {
                return
              }

              cancelInvoice.mutate(invoice, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {cancelInvoice.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Cancel invoice
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function InvoiceDetails({ invoice }: { invoice: DTOInvoicesInvoice }) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const statusMeta = getInvoiceStatusMeta(invoice)

  useEffect(() => {
    if (!copiedValue) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedValue(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedValue])

  const copyValue = (key: string, value: string | undefined) => {
    if (!value) {
      return
    }

    copyToClipboard(value)
    setCopiedValue(key)
  }

  return (
    <div className="grid gap-3 rounded-lg border p-3 text-sm">
      <CopyableDetailRow
        label="ID"
        value={invoice.id}
        copied={copiedValue === "id"}
        onCopy={() => copyValue("id", invoice.id)}
      />
      <DetailRow
        label="Status"
        value={
          <div className="grid gap-1">
            <Badge variant="secondary" className="w-fit">
              <ReceiptText />
              {getInvoiceStatusLabel(invoice.status)}
            </Badge>
            {statusMeta ? (
              <span className="text-xs text-muted-foreground">
                {statusMeta}
              </span>
            ) : null}
          </div>
        }
      />
      <DetailRow
        label="Amount"
        value={`${formatInvoiceAmount(invoice.amount, invoice.currency)} ${
          formatInvoiceCurrency(invoice.currency)
        }`}
      />
      {invoice.overpayment ? (
        <DetailRow
          label="Overpayment"
          value={`+${formatInvoiceAmount(invoice.overpayment, invoice.currency)} ${
            formatInvoiceCurrency(invoice.currency)
          }`}
        />
      ) : null}
      <CopyableDetailRow
        label="Pay to"
        value={formatAddress(invoice.pay_to_address)}
        copied={copiedValue === "pay-to"}
        onCopy={() => copyValue("pay-to", invoice.pay_to_address)}
      />
      {invoice.paid_by_address ? (
        <CopyableDetailRow
          label="Paid by"
          value={formatAddress(invoice.paid_by_address)}
          copied={copiedValue === "paid-by"}
          onCopy={() => copyValue("paid-by", invoice.paid_by_address)}
        />
      ) : (
        <DetailRow label="Paid by" value="-" />
      )}
      <DetailRow label="Created" value={formatDateTime(invoice.date_create)} />
      <DetailRow label="Expires" value={formatDateTime(invoice.date_expire)} />
      <DetailRow
        label="Description"
        value={invoice.description || "No description"}
      />
      <CopyableCodeBlock
        label="Payment link"
        value={invoice.payment_link}
        copied={copiedValue === "payment-link"}
        onCopy={() => copyValue("payment-link", invoice.payment_link)}
      />
      {invoice.info ? (
        <CopyableCodeBlock
          label="Info"
          value={JSON.stringify(invoice.info, null, 2)}
          copied={copiedValue === "info"}
          onCopy={() =>
            copyValue("info", JSON.stringify(invoice.info, null, 2))
          }
        />
      ) : null}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{value}</span>
    </div>
  )
}

function CopyableDetailRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 break-all">{value}</span>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label={`Copy invoice ${label.toLowerCase()}`}
          onClick={onCopy}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </span>
    </div>
  )
}

function CopyableCodeBlock({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="grid gap-1">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-start gap-2">
        <code className="min-w-0 flex-1 rounded bg-muted px-2 py-1 text-xs break-all whitespace-pre-wrap">
          {value}
        </code>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label={`Copy invoice ${label.toLowerCase()}`}
          onClick={onCopy}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  )
}
