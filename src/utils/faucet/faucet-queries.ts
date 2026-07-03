import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import { useSelectedProject } from "@/hooks/use-project"
import { resolveTestnetTransactionHash } from "@/utils/faucet/faucet-utils"

const FAUCET_QUERY_KEY = ["faucet"] as const

function getAvailableQueryKey(projectId: number | null | undefined) {
  return [...FAUCET_QUERY_KEY, "available", projectId] as const
}

export function useTestnetAvailableQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getAvailableQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      const response = await api.api.getTestnetAvailable({ format: "json" })
      return response.data
    },
    refetchInterval: 30 * 1000,
    staleTime: 30 * 1000,
  })
}

export function useBuyTestnetCoinsMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async ({
      address,
      coins,
    }: {
      address: string
      coins: number
    }) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.buyTestnetCoins(
        { project_id: projectId },
        { address, coins },
        { format: "json" }
      )

      const hash = await resolveTestnetTransactionHash(response.data.hash).catch(
        () => response.data.hash
      )

      return { ...response.data, hash }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAvailableQueryKey(projectId),
      })
    },
  })
}
