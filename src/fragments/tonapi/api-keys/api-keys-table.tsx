import { useEffect, useState } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  Check,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  KeyRound,
} from "lucide-react"

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

import { DeleteApiKeyDialog, EditApiKeyDialog } from "./api-key-dialogs"
import type { ApiKey } from "@/utils/tonapi/api-keys/types"

type ApiKeysTableProps = {
  apiKeys: ApiKey[]
}

type ActiveDialog =
  | { type: "edit"; apiKey: ApiKey }
  | { type: "delete"; apiKey: ApiKey }
  | null

export function ApiKeysTable({ apiKeys }: ApiKeysTableProps) {
  const [copiedKey, setCopiedKey] = useState<number | null>(null)
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)

  useEffect(() => {
    if (copiedKey === null) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedKey(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedKey])

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="min-w-[260px]">API key</TableHead>
              <TableHead>Capabilities</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="max-w-[200px] truncate font-medium">
                  {apiKey.name}
                </TableCell>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-2">
                    <code className="min-w-0 truncate rounded bg-muted px-1.5 py-1 text-xs">
                      {apiKey.token}
                    </code>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Copy API key"
                      onClick={() => {
                        copyToClipboard(apiKey.token)
                        setCopiedKey(apiKey.id)
                      }}
                    >
                      {copiedKey === apiKey.id ? <Check /> : <Copy />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{renderCapabilities(apiKey)}</TableCell>
                <TableCell>{renderLimit(apiKey)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(apiKey.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Open API key actions"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          setActiveDialog({ type: "edit", apiKey })
                        }
                      >
                        <Edit />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          setActiveDialog({ type: "delete", apiKey })
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

      <EditApiKeyDialog
        open={activeDialog?.type === "edit"}
        apiKey={activeDialog?.type === "edit" ? activeDialog.apiKey : undefined}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null)
          }
        }}
      />
      <DeleteApiKeyDialog
        open={activeDialog?.type === "delete"}
        apiKey={
          activeDialog?.type === "delete" ? activeDialog.apiKey : undefined
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

function renderCapabilities(apiKey: ApiKey) {
  if (apiKey.capabilities.length === 0) {
    return <span className="text-muted-foreground">None</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {apiKey.capabilities.map((capability) => (
        <Badge key={capability} variant="secondary">
          <KeyRound />
          {capability}
        </Badge>
      ))}
    </div>
  )
}

function renderLimit(apiKey: ApiKey) {
  if (apiKey.limitRps === undefined) {
    return <span className="text-muted-foreground">Unlimited</span>
  }

  return `IP - ${apiKey.limitRps} RPS`
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
