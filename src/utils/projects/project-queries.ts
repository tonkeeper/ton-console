import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOProject } from "@/api/api.generated"
import { fetchCurrentUser } from "@/hooks/use-auth"
import { authQueryKeys } from "@/lib/auth"

export type ProjectCreateValues = {
  name: string
  image?: File
}

export const projectQueryKeys = {
  currentUser: authQueryKeys.currentUser,
  projects: authQueryKeys.projects,
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const apiError = error as { error?: unknown }

    if (typeof apiError.error === "string") {
      return apiError.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Please try again."
}

export async function fetchProjects(): Promise<DTOProject[]> {
  const response = await api.api.getProjects({ format: "json" })

  return response.data.items
}

export async function createProject(
  values: ProjectCreateValues
): Promise<DTOProject> {
  const response = await api.api.createProject(
    {
      name: values.name,
      ...(values.image ? { image: values.image } : {}),
    },
    { format: "json" }
  )

  return response.data.project
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: projectQueryKeys.currentUser,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectQueryKeys.projects,
    queryFn: fetchProjects,
    staleTime: 60 * 1000,
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.setQueryData<DTOProject[]>(
        projectQueryKeys.projects,
        (projects = []) => {
          if (projects.some((item) => item.id === project.id)) {
            return projects
          }

          return [...projects, project]
        }
      )
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects })
    },
  })
}

export function getProjectErrorMessage(error: unknown) {
  return getErrorMessage(error)
}
