import { useMutation, useQuery } from "@tanstack/react-query"

import { api } from "@/api/client"
import { useSelectedProject } from "@/hooks/use-project"

const JETTON_QUERY_KEY = ["jetton"] as const

function getPaidMintlessQueryKey(projectId: number | null | undefined) {
  return [...JETTON_QUERY_KEY, "mintless", "paid", projectId] as const
}

export function useMintlessJettonConfigQuery() {
  return useQuery({
    queryKey: [...JETTON_QUERY_KEY, "mintless", "config"],
    queryFn: async () => {
      const response = await api.api.getMintlessJettonConfig({
        format: "json",
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function usePaidMintlessJettonsQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getPaidMintlessQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getPaidMintlessJettons(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.jettons
    },
    staleTime: 30 * 1000,
  })
}

export function useCheckMintlessJettonMutation() {
  return useMutation({
    mutationFn: async (account: string) => {
      const response = await api.api.checkExistsMintlessJetton(account, {
        format: "json",
      })
      return response.data
    },
  })
}

export function useJettonsByOwnerMutation() {
  return useMutation({
    mutationFn: async (address: string) => {
      const response = await api.api.getJettonsByOwner(
        { address },
        { format: "json" }
      )
      return response.data.items
    },
  })
}

export function useUploadMinterJettonMediaMutation() {
  return useMutation({
    mutationFn: async (media: File) => {
      const response = await api.api.uploadMinterJettonMedia(
        { media },
        { format: "json" }
      )
      return response.data
    },
  })
}

export function useUploadMinterJettonMetaMutation() {
  return useMutation({
    mutationFn: async (meta: unknown) => {
      const response = await api.api.uploadMinterJettonMeta(
        { meta },
        { format: "json" }
      )
      return response.data
    },
  })
}
