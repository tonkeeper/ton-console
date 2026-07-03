import type { QueryClient, QueryKey } from "@tanstack/react-query"

import { isUnauthorizedError } from "@/lib/api-errors"

export const authQueryKeys = {
  currentUser: ["current-user"] as const,
  projects: ["projects"] as const,
}

let isHandlingUnauthorized = false

export function clearSessionCache(queryClient: QueryClient) {
  queryClient.clear()
  queryClient.setQueryData(authQueryKeys.currentUser, null)
}

export function isCurrentUserQueryKey(queryKey: QueryKey) {
  return queryKey[0] === authQueryKeys.currentUser[0]
}

export function handleUnauthorizedError(
  queryClient: QueryClient,
  error: unknown,
  queryKey?: QueryKey
) {
  if (isHandlingUnauthorized || !isUnauthorizedError(error)) {
    return
  }

  if (queryKey && !isCurrentUserQueryKey(queryKey)) {
    return
  }

  const cachedUser = queryClient.getQueryData(authQueryKeys.currentUser)

  if (!cachedUser) {
    return
  }

  isHandlingUnauthorized = true

  try {
    clearSessionCache(queryClient)
  } finally {
    isHandlingUnauthorized = false
  }
}

export function revalidateSessionOnUnauthorized(
  queryClient: QueryClient,
  error: unknown,
  queryKey?: QueryKey
) {
  if (!isUnauthorizedError(error)) {
    return
  }

  if (queryKey && isCurrentUserQueryKey(queryKey)) {
    handleUnauthorizedError(queryClient, error, queryKey)
    return
  }

  queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser })
}
