import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOMessagesApp } from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

import type { MessageAppPayload, MessagePushPayload } from "./message-types"

const MESSAGES_QUERY_KEY = ["messages"] as const

function getMessagesAppsQueryKey(projectId: number | null | undefined) {
  return [...MESSAGES_QUERY_KEY, "apps", projectId] as const
}

function getMessagesPackagesQueryKey() {
  return [...MESSAGES_QUERY_KEY, "packages"] as const
}

function getMessagesBalanceQueryKey(projectId: number | null | undefined) {
  return [...MESSAGES_QUERY_KEY, "balance", projectId] as const
}

function getMessagesTokenQueryKey(appId: number | null | undefined) {
  return [...MESSAGES_QUERY_KEY, "token", appId] as const
}

function getMessagesStatsQueryKey(appId: number | null | undefined) {
  return [...MESSAGES_QUERY_KEY, "stats", appId] as const
}

export function useMessagesAppsQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getMessagesAppsQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getProjectMessagesApps(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.items
    },
  })
}

export function useMessagesPackagesQuery() {
  return useQuery({
    queryKey: getMessagesPackagesQueryKey(),
    queryFn: async () => {
      const response = await api.api.getMessagesPackages({ format: "json" })
      return response.data.items
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useMessagesBalanceQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getMessagesBalanceQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getProjectMessagesBalance(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.balance
    },
    staleTime: 60 * 1000,
  })
}

export function useMessagesTokenQuery(appId: number | null | undefined) {
  return useQuery({
    queryKey: getMessagesTokenQueryKey(appId),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Messages app is not registered")
      }

      const response = await api.api.getProjectMessagesAppToken(
        { app_id: appId },
        { format: "json" }
      )

      return response.data.token
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useMessagesStatsQuery(appId: number | null | undefined) {
  return useQuery({
    queryKey: getMessagesStatsQueryKey(appId),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Messages app is not registered")
      }

      const response = await api.api.getProjectMessagesStats(
        { app_id: appId },
        { format: "json" }
      )

      return response.data.stats
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateMessagesAppMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (payload: MessageAppPayload) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.createProjectMessagesApp(
        { project_id: projectId },
        {
          name: payload.name,
          url: payload.url,
          ...(payload.image ? { image: payload.image } : {}),
        },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesAppsQueryKey(projectId),
      })
    },
  })
}

export function useVerifyMessagesAppMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (payload: string) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.verifyProjectMessagesApp(
        { project_id: projectId },
        { payload },
        { format: "json" }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesAppsQueryKey(projectId),
      })
    },
  })
}

export function useDeleteMessagesAppMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (appId: number) => {
      await api.api.deleteProjectMessagesApp(
        { app_id: appId },
        { format: "json" }
      )
    },
    onSuccess: (_data, appId) => {
      queryClient.setQueryData<DTOMessagesApp[]>(
        getMessagesAppsQueryKey(projectId),
        (apps = []) => apps.filter((app) => app.id !== appId)
      )
      queryClient.invalidateQueries({
        queryKey: getMessagesAppsQueryKey(projectId),
      })
      queryClient.removeQueries({
        queryKey: getMessagesTokenQueryKey(appId),
      })
      queryClient.removeQueries({
        queryKey: getMessagesStatsQueryKey(appId),
      })
    },
  })
}

export function useRegenerateMessagesTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appId: number) => {
      const response = await api.api.regenerateProjectMessagesAppToken(
        { app_id: appId },
        { format: "json" }
      )

      return response.data.token
    },
    onSuccess: (token, appId) => {
      queryClient.setQueryData(getMessagesTokenQueryKey(appId), token)
      queryClient.invalidateQueries({
        queryKey: getMessagesTokenQueryKey(appId),
      })
    },
  })
}

export function useBuyMessagesPackageMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (packageId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.buyMessagesPackage(
        { project_id: projectId },
        { id: packageId },
        { format: "json" }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesBalanceQueryKey(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: MESSAGES_QUERY_KEY,
      })
    },
  })
}

export function useSendMessagesPushMutation(appId: number | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MessagePushPayload) => {
      if (!appId) {
        throw new Error("Messages app is not registered")
      }

      const token =
        queryClient.getQueryData<string>(getMessagesTokenQueryKey(appId)) ??
        (
          await api.api.getProjectMessagesAppToken(
            { app_id: appId },
            { format: "json" }
          )
        ).data.token

      await api.api.sendProjectMessagesPush(payload, {
        format: "json",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY })
    },
  })
}

export function getMessageErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message
    if (message) {
      return message
    }
  }

  return "Try refreshing the page."
}
