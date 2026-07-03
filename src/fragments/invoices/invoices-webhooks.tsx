import { useEffect, useId, useRef, useState } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  Check,
  Copy,
  Edit3,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  Webhook,
} from "lucide-react"

import type { DTOInvoicesAppWebhooks } from "@/api/api.generated"
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getInvoiceErrorMessage } from "@/utils/invoices/invoice-format"
import {
  useCreateInvoicesAppWebhookMutation,
  useDeleteInvoicesAppWebhookMutation,
  useUpdateInvoicesAppWebhookMutation,
} from "@/utils/invoices/invoice-queries"
import type {
  InvoiceWebhookErrors,
  InvoiceWebhookValues,
} from "@/utils/invoices/invoice-types"

type InvoiceWebhook = DTOInvoicesAppWebhooks[number]

type ActiveDialog =
  | { type: "create" }
  | { type: "edit"; webhook: InvoiceWebhook }
  | { type: "delete"; webhook: InvoiceWebhook }
  | null

type InvoicesWebhooksProps = {
  appId: number
  webhooks?: DTOInvoicesAppWebhooks
}

export function InvoicesWebhooks({
  appId,
  webhooks = [],
}: InvoicesWebhooksProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)
  const [copiedWebhookId, setCopiedWebhookId] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedWebhookId) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedWebhookId(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedWebhookId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice webhooks</CardTitle>
        <CardDescription>
          Handle invoice status changes in your backend.
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            onClick={() => setActiveDialog({ type: "create" })}
          >
            <Plus />
            Add webhook
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {webhooks.length === 0 ? (
          <Empty className="min-h-64">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Webhook />
              </EmptyMedia>
              <EmptyTitle>No invoice webhooks</EmptyTitle>
              <EmptyDescription>
                Add an endpoint to receive invoice status updates.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveDialog({ type: "create" })}
              >
                <Plus />
                Add webhook
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="[&_tr:hover]:!bg-transparent">
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2">
                        <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1.5 text-xs">
                          {webhook.webhook}
                        </code>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Copy invoice webhook URL"
                          onClick={() => {
                            copyToClipboard(webhook.webhook)
                            setCopiedWebhookId(webhook.id)
                          }}
                        >
                          {copiedWebhookId === webhook.id ? (
                            <Check />
                          ) : (
                            <Copy />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Open invoice webhook actions"
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setActiveDialog({ type: "edit", webhook })
                            }
                          >
                            <Edit3 />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              setActiveDialog({ type: "delete", webhook })
                            }
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <InvoiceWebhookDialog
        appId={appId}
        open={activeDialog?.type === "create"}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
      <InvoiceWebhookDialog
        appId={appId}
        webhook={
          activeDialog?.type === "edit" ? activeDialog.webhook : undefined
        }
        open={activeDialog?.type === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
      <DeleteInvoiceWebhookDialog
        appId={appId}
        webhook={
          activeDialog?.type === "delete" ? activeDialog.webhook : undefined
        }
        open={activeDialog?.type === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
    </Card>
  )
}

function InvoiceWebhookDialog({
  appId,
  webhook,
  open,
  onOpenChange,
}: {
  appId: number
  webhook?: InvoiceWebhook
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const formId = useId()
  const createWebhook = useCreateInvoicesAppWebhookMutation(appId)
  const updateWebhook = useUpdateInvoicesAppWebhookMutation(appId)
  const isEditing = Boolean(webhook)
  const isPending = createWebhook.isPending || updateWebhook.isPending
  const error = createWebhook.error ?? updateWebhook.error
  const [values, setValues] = useState<InvoiceWebhookValues>(
    getInvoiceWebhookDefaultValues(webhook)
  )
  const [errors, setErrors] = useState<InvoiceWebhookErrors>({})
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (!wasOpenRef.current && open) {
      setValues(getInvoiceWebhookDefaultValues(webhook))
      setErrors({})
      createWebhook.reset()
      updateWebhook.reset()
    }
    wasOpenRef.current = open
  }, [createWebhook, open, updateWebhook, webhook])

  const submit = () => {
    const nextErrors = validateInvoiceWebhook(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (webhook) {
      updateWebhook.mutate(
        { webhook, values },
        { onSuccess: () => onOpenChange(false) }
      )
      return
    }

    createWebhook.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit webhook" : "Add webhook"}
          </DialogTitle>
          <DialogDescription>
            Use an HTTPS endpoint that accepts invoice status notifications.
          </DialogDescription>
        </DialogHeader>
        <InvoiceWebhookForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={isPending}
          onChange={setValues}
          onSubmit={submit}
        />
        {error ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(error)}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : null}
            {isEditing ? "Save changes" : "Add webhook"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteInvoiceWebhookDialog({
  appId,
  webhook,
  open,
  onOpenChange,
}: {
  appId: number
  webhook?: InvoiceWebhook
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const deleteWebhook = useDeleteInvoicesAppWebhookMutation(appId)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (!wasOpenRef.current && open) {
      deleteWebhook.reset()
    }
    wasOpenRef.current = open
  }, [deleteWebhook, open])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete webhook?</AlertDialogTitle>
          <AlertDialogDescription>
            Invoice status updates will stop being sent to this endpoint.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {webhook ? (
          <code className="rounded bg-muted px-2 py-1.5 text-xs break-all">
            {webhook.webhook}
          </code>
        ) : null}
        {deleteWebhook.isError ? (
          <p className="text-sm text-destructive">
            {getInvoiceErrorMessage(deleteWebhook.error)}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteWebhook.isPending}>
            Keep webhook
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={!webhook || deleteWebhook.isPending}
            onClick={() => {
              if (!webhook) {
                return
              }

              deleteWebhook.mutate(webhook, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {deleteWebhook.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Delete webhook
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function InvoiceWebhookForm({
  formId,
  values,
  errors,
  disabled,
  onChange,
  onSubmit,
}: {
  formId: string
  values: InvoiceWebhookValues
  errors: InvoiceWebhookErrors
  disabled?: boolean
  onChange: (values: InvoiceWebhookValues) => void
  onSubmit: () => void
}) {
  return (
    <form
      id={formId}
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.webhook)}>
          <FieldLabel htmlFor={`${formId}-webhook`}>Webhook URL</FieldLabel>
          <Input
            id={`${formId}-webhook`}
            type="url"
            value={values.webhook}
            disabled={disabled}
            autoComplete="off"
            placeholder="https://myapp.com/api/invoice-change"
            onChange={(event) => onChange({ webhook: event.target.value })}
          />
          <FieldError>{errors.webhook}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}

function getInvoiceWebhookDefaultValues(
  webhook?: InvoiceWebhook
): InvoiceWebhookValues {
  return {
    webhook: webhook?.webhook ?? "",
  }
}

function validateInvoiceWebhook(values: InvoiceWebhookValues) {
  const errors: InvoiceWebhookErrors = {}
  const webhook = values.webhook.trim()

  if (!webhook) {
    errors.webhook = "Webhook URL is required."
  } else if (!/^https?:\/\/.+/i.test(webhook)) {
    errors.webhook = "Enter a valid HTTP or HTTPS URL."
  } else {
    try {
      const url = new URL(webhook)
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.webhook = "Enter a valid HTTP or HTTPS URL."
      }
    } catch {
      errors.webhook = "Enter a valid HTTP or HTTPS URL."
    }
  }

  return errors
}
