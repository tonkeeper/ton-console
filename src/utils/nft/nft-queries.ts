import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import { useSelectedProject } from "@/hooks/use-project"

import type { CnftCollection } from "./types"

const CNFT_QUERY_KEY = ["nft", "cnft"] as const

function getPaidCollectionsQueryKey(projectId: number | null | undefined) {
  return [...CNFT_QUERY_KEY, "paid-collections", projectId] as const
}

export function useCnftConfigQuery() {
  return useQuery({
    queryKey: [...CNFT_QUERY_KEY, "config"],
    queryFn: async () => {
      const response = await api.api.getCNftConfig({ format: "json" })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function usePaidCnftCollectionsQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getPaidCollectionsQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getPaidCNftCollections(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.items
    },
    staleTime: 30 * 1000,
  })
}

export function useCnftCollectionInfoMutation() {
  return useMutation({
    mutationFn: async (account: string) => {
      const response = await api.api.getInfoCNftCollectionAccount(account, {
        format: "json",
      })

      return response.data
    },
  })
}

export function useIndexCnftCollectionMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async ({
      account,
      count,
    }: {
      account: string
      count: number
    }) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.indexingCNftCollection(
        { project_id: projectId },
        { account, count },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: (collection: CnftCollection) => {
      queryClient.setQueryData<CnftCollection[]>(
        getPaidCollectionsQueryKey(projectId),
        (collections = []) => {
          const nextCollections = collections.filter(
            (item) => item.account !== collection.account
          )
          return [collection, ...nextCollections]
        }
      )
      queryClient.invalidateQueries({
        queryKey: getPaidCollectionsQueryKey(projectId),
      })
    },
  })
}
