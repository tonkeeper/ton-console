import { useEffect, useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import copyToClipboard from "copy-to-clipboard"

import type { DTOLiteproxyKey } from "@/api/api.generated"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  downloadTextFile,
  getLiteproxyConfig,
  getLiteproxyKeysText,
} from "@/utils/tonapi/liteservers/liteproxy-config"

type LiteproxyKeysTableProps = {
  keys: DTOLiteproxyKey[]
}

export function LiteproxyKeysTable({ keys }: LiteproxyKeysTableProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedValue) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedValue(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedValue])

  const copy = (value: string) => {
    copyToClipboard(value)
    setCopiedValue(value)
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => copy(getLiteproxyKeysText(keys))}
        >
          {copiedValue === getLiteproxyKeysText(keys) ? <Check /> : <Copy />}
          Copy config
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            downloadTextFile("global.config.json", getLiteproxyConfig(keys))
          }
        >
          <Download />
          Download global.config
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="[&_tr:hover]:!bg-transparent">
            <TableRow>
              <TableHead>Server</TableHead>
              <TableHead>Public key</TableHead>
              <TableHead>RPS</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={`${key.server}-${key.public_key}`}>
                <TableCell>
                  <CopyableCode
                    value={key.server}
                    copied={copiedValue === key.server}
                    onCopy={copy}
                  />
                </TableCell>
                <TableCell>
                  <CopyableCode
                    value={key.public_key}
                    copied={copiedValue === key.public_key}
                    onCopy={copy}
                  />
                </TableCell>
                <TableCell>{key.rps}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Copy liteproxy server config"
                    onClick={() =>
                      copy(
                        JSON.stringify(
                          {
                            server: key.server,
                            public_key: key.public_key,
                            rps: key.rps,
                          },
                          null,
                          2
                        )
                      )
                    }
                  >
                    <Copy />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function CopyableCode({
  value,
  copied,
  onCopy,
}: {
  value: string
  copied: boolean
  onCopy: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 max-w-[360px] truncate rounded bg-muted px-1.5 py-1 text-xs">
        {value}
      </code>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Copy value"
        onClick={() => onCopy(value)}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}
