import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOAppTier, DTOTier } from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

export type TonApiTier = {
  id: number
  name: string
  rps: number
  priceUsd: number
  priceLabel: string
  billingLabel: string
  instantPayment: boolean
}

export type SelectedTonApiTier = TonApiTier & {
  nextPayment?: number
  createdAt: number
  longPollingSubscriptions: number
  entitiesPerConnection: number
  capabilities: string[]
}

const TONAPI_TIERS_QUERY_KEY = ["tonapi", "pricing", "tiers"] as const
const TONAPI_CURRENT_TIER_QUERY_KEY = ["tonapi", "pricing", "current"] as const

function getCurrentTierQueryKey(projectId: number | null | undefined) {
  return [...TONAPI_CURRENT_TIER_QUERY_KEY, projectId] as const
}

function mapTier(tier: DTOTier): TonApiTier {
  const priceUsd = tier.instant_payment ? tier.usd_price * 1000 : tier.usd_price

  return {
    id: tier.id,
    name: tier.name,
    rps: tier.rpc,
    priceUsd,
    priceLabel: tier.instant_payment ? "per 1K requests" : "monthly",
    billingLabel: tier.instant_payment ? "Pay as you go" : "Monthly",
    instantPayment: tier.instant_payment,
  }
}

function mapSelectedTier(tier: DTOAppTier): SelectedTonApiTier {
  const baseTier = mapTier({
    id: tier.id,
    name: tier.name,
    rpc: tier.rpc,
    usd_price: tier.usd_price,
    instant_payment: tier.instant_payment,
  })

  return {
    ...baseTier,
    nextPayment: tier.next_payment,
    createdAt: tier.date_create,
    longPollingSubscriptions: tier.long_polling_sub,
    entitiesPerConnection: tier.entity_per_conn,
    capabilities: tier.capabilities,
  }
}

export function useTonApiTiersQuery() {
  return useQuery({
    queryKey: TONAPI_TIERS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.api.getTonApiTiers({ format: "json" })
      return response.data.items.map(mapTier).sort((a, b) => {
        if (!a.instantPayment && b.instantPayment) {
          return -1
        }

        if (a.instantPayment && !b.instantPayment) {
          return 1
        }

        return a.priceUsd - b.priceUsd
      })
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSelectedTonApiTierQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getCurrentTierQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getProjectTonApiTier(
        { project_id: projectId },
        { format: "json" }
      )

      return mapSelectedTier(response.data.tier)
    },
    staleTime: 30 * 1000,
  })
}

export function useCheckTonApiTierChangeMutation() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (tierId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.validChangeTonApiTier(
        tierId,
        { project_id: projectId },
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useUpdateTonApiTierMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (tierId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.updateProjectTonApiTier(
        { project_id: projectId },
        { tier_id: tierId },
        { format: "json" }
      )

      return mapSelectedTier(response.data.tier)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCurrentTierQueryKey(projectId),
      })
    },
  })
}
