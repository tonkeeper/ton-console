import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
import { FolderPlus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import TonConsoleLogo from "@/assets/ton-console-logo.svg"
import { CreateProjectForm } from "@/fragments/projects/create-project-form"
import { useSelectedProject } from "@/hooks/use-project"
import { useCreateProjectMutation } from "@/utils/projects/project-queries"

export function CreateFirstProjectPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const projects = useSelectedProject()
  const createProject = useCreateProjectMutation()

  const from = (
    location.state as
      | { from?: { pathname?: string; search?: string } }
      | null
      | undefined
  )?.from
  const nextPath =
    from?.pathname && from.pathname !== "/create-first-project"
      ? `${from.pathname}${from.search ?? ""}`
      : "/dashboard"

  if (projects.isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="grid justify-items-center gap-3">
          <span
            className="flex size-14 items-center justify-center"
            aria-hidden="true"
          >
            <TonConsoleLogo />
          </span>
          <span className="text-sm font-semibold tracking-normal text-foreground">
            TON Console
          </span>
        </div>
      </main>
    )
  }

  if (projects.projects.length) {
    return <Navigate to={nextPath} replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      {isCreating ? (
        <CreateProjectForm
          isPending={createProject.isPending}
          error={createProject.error}
          onSubmit={(values) =>
            createProject.mutate(values, {
              onSuccess: (project) => {
                projects.setSelectedProjectId(project.id)
                navigate(nextPath, { replace: true })
              },
            })
          }
        />
      ) : (
        <Empty className="min-h-96 w-full max-w-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles />
            </EmptyMedia>
            <EmptyTitle>Create a Project</EmptyTitle>
            <EmptyDescription>
              Use TON Console tools inside a project workspace.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" onClick={() => setIsCreating(true)}>
              <FolderPlus />
              Create
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </main>
  )
}
