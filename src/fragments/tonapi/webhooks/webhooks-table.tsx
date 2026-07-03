import { useEffect, useState, type KeyboardEvent } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  Check,
  Copy,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Link, useNavigate } from "react-router"

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
  DeleteWebhookDialog,
  RegenerateTokenDialog,
} from "./webhook-dialogs"
import type { Webhook, WebhookNetwork } from "@/utils/tonapi/webhooks/webhook-types"
import {
  formatDateTime,
  getWebhookStatusBadgeClassName,
  getWebhookStatusBadgeVariant,
  getWebhookStatusLabel,
} from "@/utils/tonapi/webhooks/webhook-utils"

type WebhooksTableProps = {
  webhooks: Webhook[]
  network: WebhookNetwork
}

type ActiveDialog =
  | { type: "delete"; webhook: Webhook }
  | { type: "regenerate"; webhook: Webhook }
  | null

export function WebhooksTable({ webhooks, network }: WebhooksTableProps) {
  const navigate = useNavigate()
  const [copiedWebhookId, setCopiedWebhookId] = useState<number | null>(null)
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)
  const getWebhookPath = (webhook: Webhook) =>
    `/tonapi/webhooks/${webhook.id}?network=${network}`
  const openWebhook = (webhook: Webhook) => {
    navigate(getWebhookPath(webhook))
  }

  useEffect(() => {
    if (copiedWebhookId === null) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedWebhookId(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedWebhookId])

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="min-w-[260px]">Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscriptions</TableHead>
              <TableHead className="min-w-[220px]">Token</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow
                key={webhook.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => openWebhook(webhook)}
                onKeyDown={(event) => {
                  if (isOpenWebhookKey(event)) {
                    event.preventDefault()
                    openWebhook(webhook)
                  }
                }}
              >
                <TableCell className="font-mono text-xs">
                  {webhook.id}
                </TableCell>
                <TableCell className="max-w-[360px] truncate font-medium">
                  {webhook.endpoint}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getWebhookStatusBadgeVariant(webhook.status)}
                    className={getWebhookStatusBadgeClassName(webhook.status)}
                  >
                    {getWebhookStatusLabel(webhook.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">
                      {webhook.subscribed_accounts} accounts
                    </Badge>
                    <Badge variant="secondary">
                      {webhook.subscribed_msg_opcodes} opcodes
                    </Badge>
                    {webhook.subscribed_to_mempool ? (
                      <Badge variant="outline">Mempool</Badge>
                    ) : null}
                    {webhook.subscribed_to_new_contracts ? (
                      <Badge variant="outline">New contracts</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <div className="flex min-w-0 items-center gap-2">
                    <code className="min-w-0 truncate rounded bg-muted px-1.5 py-1 text-xs">
                      {webhook.token}
                    </code>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Copy webhook token"
                      onKeyDown={(event) => event.stopPropagation()}
                      onClick={() => {
                        copyToClipboard(webhook.token)
                        setCopiedWebhookId(webhook.id)
                      }}
                    >
                      {copiedWebhookId === webhook.id ? <Check /> : <Copy />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(webhook.status_updated_at)}
                </TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Open webhook actions"
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to={getWebhookPath(webhook)}
                        >
                          <ExternalLink />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setActiveDialog({ type: "regenerate", webhook })
                        }
                      >
                        <RefreshCw />
                        Regenerate token
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

      <RegenerateTokenDialog
        network={network}
        open={activeDialog?.type === "regenerate"}
        webhook={
          activeDialog?.type === "regenerate"
            ? activeDialog.webhook
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
      <DeleteWebhookDialog
        network={network}
        open={activeDialog?.type === "delete"}
        webhook={
          activeDialog?.type === "delete" ? activeDialog.webhook : undefined
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

function isOpenWebhookKey(event: KeyboardEvent<HTMLTableRowElement>) {
  return event.key === "Enter" || event.key === " "
}
