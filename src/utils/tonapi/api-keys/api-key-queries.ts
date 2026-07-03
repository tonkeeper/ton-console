import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import {
  DTOTokenCapability,
  type DTOProjectTonApiToken,
} from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

import type { ApiKey, ApiKeyPayload } from "./types"

const API_KEYS_QUERY_KEY = ["tonapi", "api-keys"] as const

function getApiKeysQueryKey(projectId: number | null | undefined) {
  return [...API_KEYS_QUERY_KEY, projectId] as const
}

function mapToken(dto: DTOProjectTonApiToken): ApiKey {
  return {
    id: dto.id,
    name: dto.name,
    token: dto.token,
    createdAt: new Date(dto.date_create),
    limitRps: dto.limit_rps,
    origins: dto.origins ?? [],
    capabilities: (dto.capabilities ?? []).filter(
      (capability) => capability !== DTOTokenCapability.DTOWebhooks
    ),
  }
}

function normalizePayload(payload: ApiKeyPayload) {
  return {
    name: payload.name,
    limit_rps: payload.limitRps,
    origins: payload.origins,
    capabilities: payload.capabilities?.filter(
      (capability) => capability !== DTOTokenCapability.DTOWebhooks
    ),
  }
}

export function useApiKeysQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getApiKeysQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getProjectTonApiTokens(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.items.map(mapToken)
    },
  })
}

export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (payload: ApiKeyPayload) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.generateProjectTonApiToken(
        { project_id: projectId },
        normalizePayload(payload),
        { format: "json" }
      )

      return mapToken(response.data.token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getApiKeysQueryKey(projectId),
      })
    },
  })
}

export function useEditApiKeyMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: ApiKeyPayload
    }) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.updateProjectTonApiToken(
        id,
        { project_id: projectId },
        normalizePayload(payload),
        { format: "json" }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getApiKeysQueryKey(projectId),
      })
    },
  })
}

export function useDeleteApiKeyMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.deleteProjectTonApiToken(
        id,
        { project_id: projectId },
        { format: "json" }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getApiKeysQueryKey(projectId),
      })
    },
  })
}
