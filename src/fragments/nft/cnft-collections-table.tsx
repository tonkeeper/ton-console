import { useEffect, useState } from "react"
import { Check, Copy, ExternalLink } from "lucide-react"
import copyToClipboard from "copy-to-clipboard"

import { Badge } from "@/components/ui/badge"
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
  formatNumber,
  formatTonAddressBounceable,
  getExplorerAccountUrl,
} from "@/utils/nft/nft-utils"
import type { CnftCollection } from "@/utils/nft/types"

type CnftCollectionsTableProps = {
  collections: CnftCollection[]
}

export function CnftCollectionsTable({
  collections,
}: CnftCollectionsTableProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  useEffect(() => {
    if (copiedAccount === null) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedAccount(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedAccount])

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead className="min-w-[260px]">Address</TableHead>
            <TableHead>Minted</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => {
            const remainingCount =
              collection.nft_count - collection.paid_indexing_count
            const formattedAccount = formatTonAddressBounceable(
              collection.account
            )

            return (
              <TableRow key={collection.account}>
                <TableCell className="max-w-[240px]">
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {collection.name || "Untitled collection"}
                    </div>
                    {collection.description ? (
                      <div className="truncate text-sm text-muted-foreground">
                        {collection.description}
                      </div>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-2">
                    <a
                      className="min-w-0 truncate font-mono text-xs text-primary underline-offset-4 hover:underline"
                      href={getExplorerAccountUrl(formattedAccount)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {formattedAccount}
                    </a>
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Copy collection address"
                      onClick={() => {
                        copyToClipboard(formattedAccount)
                        setCopiedAccount(collection.account)
                      }}
                    >
                      {copiedAccount === collection.account ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{formatNumber(collection.minted_count)}</TableCell>
                <TableCell>
                  {formatNumber(collection.paid_indexing_count)}
                </TableCell>
                <TableCell>{formatNumber(collection.nft_count)}</TableCell>
                <TableCell>
                  <Badge variant={remainingCount > 0 ? "outline" : "secondary"}>
                    {remainingCount > 0
                      ? `${formatNumber(remainingCount)} available`
                      : "Fully paid"}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
