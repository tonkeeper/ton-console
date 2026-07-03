import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type {
  DTOLiteproxyKey,
  DTOLiteproxyTier,
  DTOProjectLiteproxyTierDetail,
} from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

export type LiteproxyTier = {
  id: number
  name: string
  rps: number
  priceUsd: number
}

export type SelectedLiteproxyTier = LiteproxyTier & {
  nextPayment?: number
  createdAt: number
}

const LITEPROXY_KEYS_QUERY_KEY = ["tonapi", "liteproxy", "keys"] as const
const LITEPROXY_TIERS_QUERY_KEY = ["tonapi", "liteproxy", "tiers"] as const
const LITEPROXY_CURRENT_TIER_QUERY_KEY = [
  "tonapi",
  "liteproxy",
  "current",
] as const

function getKeysQueryKey(projectId: number | null | undefined) {
  return [...LITEPROXY_KEYS_QUERY_KEY, projectId] as const
}

function getCurrentTierQueryKey(projectId: number | null | undefined) {
  return [...LITEPROXY_CURRENT_TIER_QUERY_KEY, projectId] as const
}

function mapTier(tier: DTOLiteproxyTier): LiteproxyTier {
  return {
    id: tier.id,
    name: tier.name,
    rps: tier.rps,
    priceUsd: tier.usd_price,
  }
}

function mapSelectedTier(
  tier: DTOProjectLiteproxyTierDetail
): SelectedLiteproxyTier {
  return {
    id: tier.id,
    name: tier.name,
    rps: tier.rps,
    priceUsd: tier.usd_price,
    nextPayment: tier.next_payment,
    createdAt: tier.date_create,
  }
}

export function useLiteproxyKeysQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getKeysQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      try {
        const response = await api.api.getLiteproxyKeys(
          { project_id: projectId },
          { format: "json" }
        )
        return response.data.keys
      } catch (error) {
        if (isKeysNotFoundError(error)) {
          return [] satisfies DTOLiteproxyKey[]
        }

        throw error
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useLiteproxyTiersQuery() {
  return useQuery({
    queryKey: LITEPROXY_TIERS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.api.getLiteproxyTiers({ format: "json" })
      return response.data.tiers.map(mapTier).sort((a, b) => a.priceUsd - b.priceUsd)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSelectedLiteproxyTierQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getCurrentTierQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      try {
        const response = await api.api.getProjectLiteproxyTier(
          { project_id: projectId },
          { format: "json" }
        )

        return mapSelectedTier(response.data.tier)
      } catch (error) {
        if (isNotFoundError(error)) {
          return null
        }

        throw error
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useCreateLiteproxyKeysMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.createLiteproxyKeys(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.keys
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getKeysQueryKey(projectId) })
      queryClient.invalidateQueries({
        queryKey: getCurrentTierQueryKey(projectId),
      })
    },
  })
}

export function useCheckLiteproxyTierChangeMutation() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (tierId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.validChangeLiteproxyTier(
        tierId,
        { project_id: projectId },
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useUpdateLiteproxyTierMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (tierId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.updateLiteproxyTier(
        { project_id: projectId },
        { tier_id: tierId },
        { format: "json" }
      )

      return tierId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCurrentTierQueryKey(projectId),
      })
    },
  })
}

function isKeysNotFoundError(error: unknown) {
  return getApiError(error) === "keys not found"
}

function isNotFoundError(error: unknown) {
  return getApiError(error) === "not found"
}

function getApiError(error: unknown) {
  if (!error || typeof error !== "object" || !("error" in error)) {
    return undefined
  }

  const payload = (error as { error?: { error?: string } }).error
  return payload?.error
}
