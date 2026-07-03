import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTonConnectUI } from "@tonconnect/ui-react"

import { api } from "@/api/client"
import type { DTOTonConnectProof, DTOUser } from "@/api/api.generated"
import { isUnauthorizedError } from "@/lib/api-errors"
import { authQueryKeys, clearSessionCache } from "@/lib/auth"

export async function fetchCurrentUser(): Promise<DTOUser | null> {
  try {
    const response = await api.api.getUserInfo({ format: "json" })

    return response.data.user
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null
    }

    throw error
  }
}

export function useSessionQuery() {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTonConnectLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (proof: DTOTonConnectProof) => {
      await api.api.authViaTonConnect(proof, { format: "json" })

      return fetchCurrentUser()
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.currentUser, user)
      queryClient.invalidateQueries({ queryKey: authQueryKeys.projects })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const [tonConnectUI] = useTonConnectUI()

  return useMutation({
    mutationFn: async () => {
      try {
        await api.api.accountLogout({ format: "json" })
      } catch (error) {
        if (!isUnauthorizedError(error)) {
          throw error
        }
      }

      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect()
      }
    },
    onSettled: () => {
      clearSessionCache(queryClient)
    },
  })
}
