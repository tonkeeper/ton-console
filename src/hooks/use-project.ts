import { useEffect, useMemo, useSyncExternalStore } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOParticipant, DTOProject } from "@/api/api.generated"
import { fetchCurrentUser } from "@/hooks/use-auth"
import { authQueryKeys } from "@/lib/auth"

const selectedProjectStorageKey = "ton-console:selected-project-id"
const selectedProjectListeners = new Set<() => void>()

function getStoredProjectId() {
  if (typeof window === "undefined") {
    return null
  }

  const value = window.localStorage.getItem(selectedProjectStorageKey)
  const parsed = value ? Number(value) : NaN

  return Number.isFinite(parsed) ? parsed : null
}

function storeProjectId(projectId: number | null) {
  if (typeof window === "undefined") {
    return
  }

  if (projectId === null) {
    window.localStorage.removeItem(selectedProjectStorageKey)
    return
  }

  window.localStorage.setItem(selectedProjectStorageKey, String(projectId))
}

function subscribeToSelectedProject(listener: () => void) {
  selectedProjectListeners.add(listener)

  return () => {
    selectedProjectListeners.delete(listener)
  }
}

function notifySelectedProjectListeners() {
  selectedProjectListeners.forEach((listener) => listener())
}

function setStoredProjectId(projectId: number | null) {
  storeProjectId(projectId)
  notifySelectedProjectListeners()
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: authQueryKeys.projects,
    queryFn: async () => {
      const response = await api.api.getProjects({ format: "json" })
      return response.data.items
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSelectedProject() {
  const queryClient = useQueryClient()
  const projectsQuery = useProjectsQuery()
  const selectedProjectId = useSyncExternalStore(
    subscribeToSelectedProject,
    getStoredProjectId,
    () => null
  )

  const projects = projectsQuery.data ?? []

  const selectedProject = useMemo(() => {
    if (!projects.length) {
      return null
    }

    return (
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0]
    )
  }, [projects, selectedProjectId])

  useEffect(() => {
    if (!selectedProject) {
      return
    }

    if (selectedProject.id !== selectedProjectId) {
      setStoredProjectId(selectedProject.id)
    }
  }, [selectedProject, selectedProjectId])

  const setSelectedProjectId = (projectId: number | null) => {
    if (projectId === selectedProjectId) {
      return
    }

    setStoredProjectId(projectId)
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] !== "current-user",
    })
  }

  return {
    ...projectsQuery,
    projects,
    selectedProject,
    selectedProjectId: selectedProject?.id ?? selectedProjectId,
    setSelectedProjectId,
  }
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      image,
      removeImage,
    }: {
      projectId: number
      name?: string
      image?: File
      removeImage?: boolean
    }) => {
      const response = await api.api.updateProject(
        projectId,
        {
          ...(name !== undefined ? { name } : {}),
          ...(image ? { image } : {}),
          ...(removeImage ? { remove_image: true } : {}),
        },
        { format: "json" }
      )

      return response.data.project
    },
    onSuccess: (project) => {
      queryClient.setQueryData<DTOProject[]>(
        authQueryKeys.projects,
        (projects = []) =>
          projects.map((item) => (item.id === project.id ? project : item))
      )
      queryClient.invalidateQueries({ queryKey: authQueryKeys.projects })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectId: number) => {
      await api.api.deleteProject(projectId, { format: "json" })
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.setQueryData<DTOProject[]>(
        authQueryKeys.projects,
        (projects = []) =>
          projects.filter((project) => project.id !== projectId)
      )
      queryClient.invalidateQueries({ queryKey: authQueryKeys.projects })
    },
  })
}

export function useProjectParticipantsQuery(projectId: number | null) {
  return useQuery({
    queryKey: ["project-participants", projectId],
    queryFn: async () => {
      if (!projectId) {
        return []
      }

      const response = await api.api.getProjectParticipants(projectId, {
        format: "json",
      })

      return response.data.items
    },
    enabled: Boolean(projectId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useAddProjectParticipantMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.addProjectParticipant(
        projectId,
        { user_id: userId },
        { format: "json" }
      )

      return response.data.participant
    },
    onSuccess: (participant) => {
      queryClient.setQueryData<DTOParticipant[]>(
        ["project-participants", projectId],
        (participants = []) => {
          if (participants.some((item) => item.id === participant.id)) {
            return participants
          }

          return [...participants, participant]
        }
      )
      queryClient.invalidateQueries({
        queryKey: ["project-participants", projectId],
      })
    },
  })
}

export function useDeleteProjectParticipantMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.deleteProjectParticipant(projectId, userId, {
        format: "json",
      })

      return userId
    },
    onSuccess: (userId) => {
      queryClient.setQueryData<DTOParticipant[]>(
        ["project-participants", projectId],
        (participants = []) =>
          participants.filter((participant) => participant.id !== userId)
      )
      queryClient.invalidateQueries({
        queryKey: ["project-participants", projectId],
      })
    },
  })
}
