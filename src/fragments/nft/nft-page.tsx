import { useState } from "react"
import {
  AlertCircle,
  CircleDollarSign,
  Database,
  Loader2,
  Plus,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useSelectedProject } from "@/hooks/use-project"

import { CnftIndexDialog } from "./cnft-index-dialog"
import { CnftCollectionsTable } from "./cnft-collections-table"
import { useCnftConfigQuery, usePaidCnftCollectionsQuery } from "@/utils/nft/nft-queries"
import { formatNumber, formatUsdAmount, getApiErrorMessage } from "@/utils/nft/nft-utils"

export function NftPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { isLoading: isProjectLoading, selectedProject } = useSelectedProject()
  const configQuery = useCnftConfigQuery()
  const collectionsQuery = usePaidCnftCollectionsQuery()
  const collections = collectionsQuery.data ?? []
  const totalPaid = collections.reduce(
    (sum, collection) => sum + collection.paid_indexing_count,
    0
  )

  if (isProjectLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <div className="grid gap-4">
        <PageHeader
          title="cNFT"
          description="Select or create a project to manage cNFT indexing."
        />
        <Card>
          <CardContent>
            <Empty className="min-h-72">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Database />
                </EmptyMedia>
                <EmptyTitle>No project selected</EmptyTitle>
                <EmptyDescription>
                  cNFT collections are indexed per project.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title="cNFT"
        description="Add compressed NFT collections and pay for indexing capacity used by this project."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus />
            Add cNFT
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardHeader>
            <CardTitle>cNFT indexing</CardTitle>
            <CardDescription>Current indexing capacity and price.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Metric
              icon={<Database />}
              label="Paid collections"
              value={formatNumber(collections.length)}
            />
            <Metric
              icon={<CircleDollarSign />}
              label="Indexed capacity"
              value={formatNumber(totalPaid)}
            />
            <Metric
              icon={<CircleDollarSign />}
              label="Price per cNFT"
              value={
                configQuery.isLoading
                  ? "Loading"
                  : configQuery.data
                    ? formatUsdAmount(configQuery.data.usd_price_per_nft)
                    : "-"
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Config</CardTitle>
            <CardDescription>Current service price.</CardDescription>
          </CardHeader>
          <CardContent>
            {configQuery.isLoading ? (
              <div className="flex h-20 items-center text-muted-foreground">
                <Loader2 className="mr-2 animate-spin" />
                Loading config
              </div>
            ) : null}

            {configQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Config unavailable</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(configQuery.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {configQuery.isSuccess ? (
              <div>
                <div className="text-3xl font-semibold tabular-nums">
                  {formatUsdAmount(configQuery.data.usd_price_per_nft)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Charged for each cNFT indexing slot.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paid collections</CardTitle>
          <CardDescription>
            Collections that already have paid cNFT indexing capacity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {collectionsQuery.isLoading ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 animate-spin" />
              Loading cNFT collections
            </div>
          ) : null}

          {collectionsQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error loading paid collections</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(collectionsQuery.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          {collectionsQuery.isSuccess && collections.length === 0 ? (
            <Empty className="min-h-72">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Database />
                </EmptyMedia>
                <EmptyTitle>No cNFT collections yet</EmptyTitle>
                <EmptyDescription>
                  Add a collection to start indexing compressed NFTs.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus />
                  Add cNFT
                </Button>
              </EmptyContent>
            </Empty>
          ) : null}

          {collectionsQuery.isSuccess && collections.length > 0 ? (
            <CnftCollectionsTable collections={collections} />
          ) : null}
        </CardContent>
      </Card>

      <CnftIndexDialog
        open={dialogOpen}
        pricePerNft={configQuery.data?.usd_price_per_nft}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-foreground [&_svg]:size-4">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}
