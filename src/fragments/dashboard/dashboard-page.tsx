import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import {
  getProjectErrorMessage,
  useCurrentUserQuery,
} from "@/utils/projects/project-queries"
import { TonApiUsageSection } from "@/fragments/tonapi/statistics/tonapi-usage-section"

export function DashboardPage() {
  const currentUser = useCurrentUserQuery()

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Dashboard"
        description="A compact overview of your account and project workspaces."
      />

      {currentUser.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>API session is not ready</AlertTitle>
          <AlertDescription>
            {getProjectErrorMessage(currentUser.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      <TonApiUsageSection />
    </div>
  )
}
