import { useEffect, useId, useRef, useState } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Link, useNavigate } from "react-router"

import {
  AlertDialog,
  AlertDialogAction,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  useCreateWebhookMutation,
  useDeleteWebhookMutation,
  useRegenerateWebhookTokenMutation,
} from "@/utils/tonapi/webhooks/webhook-queries"
import type {
  Webhook,
  WebhookNetwork,
} from "@/utils/tonapi/webhooks/webhook-types"
import {
  getApiErrorMessage,
  normalizeEndpoint,
  validateEndpoint,
} from "@/utils/tonapi/webhooks/webhook-utils"

type CreateWebhookDialogProps = {
  network: WebhookNetwork
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWebhookDialog({
  network,
  open,
  onOpenChange,
}: CreateWebhookDialogProps) {
  const navigate = useNavigate()
  const formId = useId()
  const createWebhook = useCreateWebhookMutation(network)
  const [endpoint, setEndpoint] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [copiedCreatedToken, setCopiedCreatedToken] = useState(false)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setEndpoint("")
      setError(null)
      setCreatedToken(null)
      setCopiedCreatedToken(false)
      createWebhook.reset()
    }
    wasOpenRef.current = open
  }, [createWebhook, open])

  useEffect(() => {
    if (!copiedCreatedToken) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedCreatedToken(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedCreatedToken])

  const submit = () => {
    const endpointError = validateEndpoint(endpoint)
    setError(endpointError)

    if (endpointError) {
      return
    }

    createWebhook.mutate(normalizeEndpoint(endpoint), {
      onSuccess: (result) => {
        setCreatedToken(result.token)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New webhook</DialogTitle>
          <DialogDescription>
            Create an HTTPS endpoint for TonAPI events on {network}.
          </DialogDescription>
        </DialogHeader>

        {createdToken ? (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              Webhook created. Copy this token now and use it to verify TonAPI
              requests.
            </p>
            <div className="rounded-lg border bg-muted p-3">
              <div className="flex min-w-0 items-center gap-2">
                <code className="min-w-0 flex-1 text-xs break-all">
                  {createdToken}
                </code>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Copy created webhook token"
                  onClick={() => {
                    copyToClipboard(createdToken)
                    setCopiedCreatedToken(true)
                  }}
                >
                  {copiedCreatedToken ? <Check /> : <Copy />}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form
            id={formId}
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor={`${formId}-endpoint`}>Endpoint</FieldLabel>
              <Input
                id={`${formId}-endpoint`}
                value={endpoint}
                placeholder="https://example.com/tonapi/webhook"
                disabled={createWebhook.isPending}
                onChange={(event) => {
                  setEndpoint(event.target.value)
                  setError(null)
                }}
              />
              <FieldDescription>
                TonAPI sends webhook events to this HTTPS URL.
              </FieldDescription>
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
          </form>
        )}

        {createWebhook.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              createWebhook.error,
              "Webhook was not created."
            )}
          </p>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={createWebhook.isPending}>
              {createdToken ? "Close" : "Cancel"}
            </Button>
          </DialogClose>
          {!createdToken ? (
            <Button
              form={formId}
              type="submit"
              disabled={createWebhook.isPending}
            >
              {createWebhook.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Create
            </Button>
          ) : createWebhook.data?.webhook_id ? (
            <Button
              onClick={() => {
                onOpenChange(false)
                navigate(
                  `/tonapi/webhooks/${createWebhook.data.webhook_id}?network=${network}`
                )
              }}
            >
              Open webhook
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DeleteWebhookDialogProps = {
  network: WebhookNetwork
  webhook?: Webhook
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteWebhookDialog({
  network,
  webhook,
  open,
  onOpenChange,
}: DeleteWebhookDialogProps) {
  const deleteWebhook = useDeleteWebhookMutation(network)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      deleteWebhook.reset()
    }
    wasOpenRef.current = open
  }, [deleteWebhook, open])

  const submit = () => {
    if (!webhook) {
      return
    }

    deleteWebhook.mutate(webhook.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete webhook?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the webhook and all of its subscriptions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {webhook ? (
          <div className="rounded-lg border bg-muted p-3">
            <code className="block truncate text-xs">{webhook.endpoint}</code>
          </div>
        ) : null}
        {deleteWebhook.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              deleteWebhook.error,
              "Webhook was not deleted."
            )}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteWebhook.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteWebhook.isPending}
            onClick={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            {deleteWebhook.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type RegenerateTokenDialogProps = {
  network: WebhookNetwork
  webhook?: Webhook
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegenerateTokenDialog({
  network,
  webhook,
  open,
  onOpenChange,
}: RegenerateTokenDialogProps) {
  const regenerateToken = useRegenerateWebhookTokenMutation(network)
  const [token, setToken] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setToken(null)
      setCopiedToken(false)
      regenerateToken.reset()
    }
    wasOpenRef.current = open
  }, [open, regenerateToken])

  useEffect(() => {
    if (!copiedToken) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedToken(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedToken])

  const submit = () => {
    if (!webhook) {
      return
    }

    regenerateToken.mutate(webhook.id, {
      onSuccess: (result) => setToken(result.token),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <RefreshCw />
          </AlertDialogMedia>
          <AlertDialogTitle>Regenerate token?</AlertDialogTitle>
          <AlertDialogDescription>
            The current token will stop working. Update your endpoint
            verification with the new token after regenerating it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {token ? (
          <div className="rounded-lg border bg-muted p-3">
            <div className="flex min-w-0 items-center gap-2">
              <code className="min-w-0 flex-1 text-xs break-all">{token}</code>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Copy regenerated webhook token"
                onClick={() => {
                  copyToClipboard(token)
                  setCopiedToken(true)
                }}
              >
                {copiedToken ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
        ) : null}
        {regenerateToken.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              regenerateToken.error,
              "Token was not regenerated."
            )}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={regenerateToken.isPending}>
            {token ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {!token ? (
            <AlertDialogAction
              disabled={regenerateToken.isPending}
              onClick={(event) => {
                event.preventDefault()
                submit()
              }}
            >
              {regenerateToken.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Regenerate
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type WebhookSuspendedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebhookSuspendedDialog({
  open,
  onOpenChange,
}: WebhookSuspendedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Webhook suspended</DialogTitle>
          <DialogDescription>
            This webhook has been suspended due to insufficient balance. Refill
            the project balance, then return here and use Try online to restore
            delivery.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              Notifications will remain paused until the balance issue is fixed
              and the webhook is brought back online.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button asChild>
            <Link to="/billing" onClick={() => onOpenChange(false)}>
              Top up balance
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
