import { useState } from "react"
import { AlertCircle, BarChart3, KeyRound, Loader2, Plus } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSelectedProject } from "@/hooks/use-project"

import { CreateApiKeyDialog } from "./api-key-dialogs"
import { useApiKeysQuery } from "@/utils/tonapi/api-keys/api-key-queries"
import { ApiKeysTable } from "./api-keys-table"
import { RestApiStatisticsDialog } from "@/fragments/tonapi/statistics/tonapi-statistics-dialog"

export function TonApiApiKeysPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const projectQuery = useSelectedProject()
  const apiKeysQuery = useApiKeysQuery()

  return (
    <div className="grid gap-4">
      <PageHeader
        title="TonAPI API keys"
        description="Create and manage project tokens used to access TonAPI."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!projectQuery.selectedProjectId}
              onClick={() => setStatsOpen(true)}
            >
              <BarChart3 />
              Statistics
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create API key
            </Button>
          </>
        }
      />
      {apiKeysQuery.isSuccess && apiKeysQuery.data.length === 0 ? (
        <EmptyState
          className="min-h-96"
          icon={<KeyRound />}
          title="Your API keys will be shown here"
          description="Create your first API key."
          actions={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create API key
            </Button>
          }
        />
      ) : null}

      {apiKeysQuery.isLoading ||
      apiKeysQuery.isError ||
      (apiKeysQuery.isSuccess && apiKeysQuery.data.length > 0) ? (
        <Card>
          <CardContent>
            {apiKeysQuery.isLoading ? (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 animate-spin" />
                Loading API keys
              </div>
            ) : null}

            {apiKeysQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error loading API keys</AlertTitle>
                <AlertDescription>
                  {getQueryErrorMessage(apiKeysQuery.error)}
                </AlertDescription>
              </Alert>
            ) : null}

            {apiKeysQuery.isSuccess && apiKeysQuery.data.length > 0 ? (
              <ApiKeysTable apiKeys={apiKeysQuery.data} />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <CreateApiKeyDialog open={createOpen} onOpenChange={setCreateOpen} />
      <RestApiStatisticsDialog open={statsOpen} onOpenChange={setStatsOpen} />
    </div>
  )
}

function getQueryErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Try refreshing the page."
}
