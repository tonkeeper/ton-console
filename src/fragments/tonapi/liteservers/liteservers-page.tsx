import { useState } from "react"
import { AlertCircle, BarChart3, KeyRound, Loader2, Plus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSelectedProject } from "@/hooks/use-project"

import { getApiErrorMessage } from "@/utils/tonapi/pricing/pricing-utils"
import { LiteproxyKeysTable } from "./liteproxy-keys-table"
import {
  useCreateLiteproxyKeysMutation,
  useLiteproxyKeysQuery,
  useSelectedLiteproxyTierQuery,
} from "@/utils/tonapi/liteservers/liteservers-queries"
import { LiteproxyStatisticsDialog } from "@/fragments/tonapi/statistics/tonapi-statistics-dialog"

export function TonApiLiteserversPage() {
  const projectQuery = useSelectedProject()
  const keysQuery = useLiteproxyKeysQuery()
  const currentTierQuery = useSelectedLiteproxyTierQuery()
  const createKeys = useCreateLiteproxyKeysMutation()
  const [statsOpen, setStatsOpen] = useState(false)

  const projectId = projectQuery.selectedProjectId
  const keys = keysQuery.data ?? []
  const hasKeys = keys.length > 0
  const hasNoKeys = keysQuery.isSuccess && !hasKeys
  const shouldRenderContentCard =
    projectQuery.isLoading ||
    (!projectQuery.isLoading && !projectId) ||
    currentTierQuery.isError ||
    createKeys.isError ||
    keysQuery.isLoading ||
    keysQuery.isError ||
    (keysQuery.isSuccess && hasKeys)

  return (
    <div className="grid gap-4">
      <PageHeader
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            Liteservers
            <Badge variant="secondary">Beta</Badge>
          </span>
        }
        description="Manage liteproxy keys and Liteserver throughput for this project."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!projectId}
              onClick={() => setStatsOpen(true)}
            >
              <BarChart3 />
              Statistics
            </Button>
            <Button
              disabled={!projectId || createKeys.isPending}
              onClick={() => createKeys.mutate()}
            >
              {createKeys.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Create keys
            </Button>
          </>
        }
      />
      {shouldRenderContentCard ? (
        <Card>
          <CardContent className="grid gap-4">
            {projectQuery.isLoading ? (
              <LoadingState label="Loading project" />
            ) : null}

            {!projectQuery.isLoading && !projectId ? (
              <Alert>
                <AlertCircle />
                <AlertTitle>No project selected</AlertTitle>
                <AlertDescription>
                  Create or select a project before creating liteproxy keys.
                </AlertDescription>
              </Alert>
            ) : null}

            {currentTierQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error loading current tier</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(currentTierQuery.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {createKeys.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Unable to create liteproxy keys</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(createKeys.error, "Keys were not created.")}
                </AlertDescription>
              </Alert>
            ) : null}

            {keysQuery.isLoading ? <LoadingState label="Loading keys" /> : null}

            {keysQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error loading liteproxy keys</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(keysQuery.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {keysQuery.isSuccess && hasKeys ? (
              <LiteproxyKeysTable keys={keys} />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {hasNoKeys ? (
        <EmptyState
          className="min-h-96"
          icon={<KeyRound />}
          title="No liteproxy keys yet"
          description="Create keys to receive Liteserver endpoints for this project."
          actions={
            <Button
              disabled={!projectId || createKeys.isPending}
              onClick={() => createKeys.mutate()}
            >
              {createKeys.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Create keys
            </Button>
          }
        />
      ) : null}
      <LiteproxyStatisticsDialog open={statsOpen} onOpenChange={setStatsOpen} />
    </div>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 animate-spin" />
      {label}
    </div>
  )
}
