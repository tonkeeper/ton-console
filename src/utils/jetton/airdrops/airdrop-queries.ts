import { toNano } from "@ton/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOJettonAirdrop } from "@/api/api.generated"
import type {
  ADConfig,
  ADAirdropData,
  ADDistributorData,
} from "@/api/airdrop.generated"
import { apiFetch } from "@/api/fetch"
import { joinApiBaseUrl, normalizeApiBaseUrl } from "@/api/base-url"
import { useSelectedProject } from "@/hooks/use-project"
import {
  getAirdropOnChainStatus,
  hasUploadedAirdropFile,
} from "@/utils/jetton/airdrops/airdrop-utils"

export const AIRDROP_QUERY_KEY = ["jetton", "airdrops"] as const

export type CreateAirdropInput = {
  name: string
  admin: string
  jetton: string
  minCommission: string
  vesting?: {
    unlockTime: number
    fraction: number
  }[]
}

export type UploadAirdropFileInput = {
  id: string
  file?: File
  url?: string
  onProgress?: (progress: number) => void
}

export type SwitchClaimInput = {
  id: string
  nextStatus: "open" | "closed"
}

export type AirdropDetail = {
  record: DTOJettonAirdrop
  airdrop: ADAirdropData | null
  distributors: ADDistributorData[]
}

function getAirdropApiBaseUrl() {
  const explicitBaseUrl = import.meta.env.VITE_AIRDROP_BASE_URL

  if (explicitBaseUrl) {
    return normalizeApiBaseUrl(explicitBaseUrl)
  }

  return joinApiBaseUrl(import.meta.env.VITE_BASE_URL ?? "", "/airdrop-api")
}

function createAirdropApiUrl(
  path: string,
  query: Record<string, number | string | undefined>
) {
  const baseUrl = getAirdropApiBaseUrl()
  const url = new URL(
    `${baseUrl}${path}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  )

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function parseAirdropResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  let data: unknown = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch (error) {
      if (!response.ok) {
        throw new Error(text)
      }

      throw error
    }
  }

  if (!response.ok) {
    throw data ?? new Error(response.statusText)
  }

  return data as T
}

async function getAirdropConfig(projectId: number) {
  const response = await apiFetch(
    createAirdropApiUrl("/v2/config", { project_id: projectId })
  )

  return parseAirdropResponse<ADConfig>(response)
}

async function getAirdropData(id: string, projectId: number) {
  const response = await apiFetch(
    createAirdropApiUrl("/v2/airdrop", {
      id,
      project_id: projectId,
    })
  )

  return parseAirdropResponse<ADAirdropData | null>(response)
}

async function getDistributorsData(id: string, projectId: number) {
  const response = await apiFetch(
    createAirdropApiUrl("/v2/airdrop/distributors", {
      id,
      project_id: projectId,
    })
  )
  const data = await parseAirdropResponse<{
    distributors?: ADDistributorData[] | null
  } | null>(response)

  return data?.distributors ?? []
}

async function createServiceAirdrop(
  input: CreateAirdropInput,
  projectId: number
) {
  const response = await apiFetch(
    createAirdropApiUrl("/v2/airdrop", { project_id: projectId }),
    {
      method: "POST",
      body: JSON.stringify({
        admin: input.admin,
        jetton: input.jetton,
        royalty_parameters: {
          min_commission: toNano(input.minCommission || "0").toString(),
        },
        ...(input.vesting?.length
          ? {
              vesting_parameters: {
                unlocks_list: input.vesting.map((item) => ({
                  unlock_time: item.unlockTime,
                  fraction: item.fraction,
                })),
              },
            }
          : {}),
      }),
    }
  )

  return parseAirdropResponse<{ id: string }>(response)
}

async function uploadAirdropFile(
  input: UploadAirdropFileInput,
  projectId: number
) {
  const formData = new FormData()

  if (input.file) {
    formData.set("file", input.file)
  }

  if (input.url) {
    formData.set("url", input.url)
  }

  await uploadAirdropRequest(
    createAirdropApiUrl("/v2/airdrop/upload", {
      id: input.id,
      project_id: projectId,
    }),
    formData,
    input.onProgress
  )
}

function uploadAirdropRequest(
  url: string,
  body: FormData,
  onProgress: ((progress: number) => void) | undefined
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.open("POST", url)
    request.withCredentials = true
    request.setRequestHeader("Accept", "application/json")

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return
      }

      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    request.onload = () => {
      onProgress?.(100)

      if (request.status >= 200 && request.status < 300) {
        resolve()
        return
      }

      reject(parseUploadError(request.responseText, request.statusText))
    }

    request.onerror = () => reject(new Error("File upload failed"))
    request.send(body)
  })
}

function parseUploadError(text: string, fallback: string) {
  if (!text) {
    return new Error(fallback || "File upload failed")
  }

  try {
    const data = JSON.parse(text) as unknown
    if (data && typeof data === "object" && "error" in data) {
      const error = (data as { error?: unknown }).error
      if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === "string") {
          return new Error(message)
        }
      }
      if (typeof error === "string") {
        return new Error(error)
      }
    }
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message
      if (typeof message === "string") {
        return new Error(message)
      }
    }
  } catch {
    return new Error(text)
  }

  return new Error(text)
}

async function switchAirdropClaim(input: SwitchClaimInput, projectId: number) {
  const response = await apiFetch(
    createAirdropApiUrl(
      input.nextStatus === "open" ? "/v2/airdrop/start" : "/v2/airdrop/stop",
      { id: input.id, project_id: projectId }
    ),
    { method: "POST" }
  )

  if (!response.ok) {
    await parseAirdropResponse(response)
  }
}

function getAirdropsQueryKey(projectId: number | null | undefined) {
  return [...AIRDROP_QUERY_KEY, "list", projectId] as const
}

function getAirdropDetailQueryKey(
  projectId: number | null | undefined,
  airdropId: string | null | undefined
) {
  return [...AIRDROP_QUERY_KEY, "detail", projectId, airdropId] as const
}

function getAirdropConfigQueryKey(projectId: number | null | undefined) {
  return [...AIRDROP_QUERY_KEY, "config", projectId] as const
}

export function useAirdropConfigQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getAirdropConfigQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      return getAirdropConfig(projectId)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useJettonAirdropsQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getAirdropsQueryKey(projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getJettonAirdrops(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data.airdrops
    },
    staleTime: 30 * 1000,
  })
}

export function useAirdropDetailQuery(airdrop: DTOJettonAirdrop | null) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getAirdropDetailQueryKey(projectId, airdrop?.api_id),
    enabled: Boolean(projectId && airdrop?.api_id),
    queryFn: async () => {
      if (!projectId || !airdrop?.api_id) {
        throw new Error("No airdrop selected")
      }

      const [airdropData, distributors] = await Promise.all([
        getAirdropData(airdrop.api_id, projectId),
        getDistributorsData(airdrop.api_id, projectId),
      ])

      return {
        record: airdrop,
        airdrop: airdropData,
        distributors,
      } satisfies AirdropDetail
    },
    staleTime: 15 * 1000,
    refetchInterval: (query) => {
      const detail = query.state.data
      const airdropData = detail?.airdrop

      if (!airdropData || airdropData.upload_error) {
        return false
      }

      if (airdropData.upload_in_progress) {
        return 2_000
      }

      if (
        hasUploadedAirdropFile(airdropData) &&
        detail.distributors.length === 0
      ) {
        return 2_000
      }

      const onChainStatus = getAirdropOnChainStatus(detail.distributors)
      return onChainStatus !== "waiting" &&
        onChainStatus !== "withdraw_complete"
        ? 2_000
        : false
    },
  })
}

export function useCreateAirdropMutation() {
  const { selectedProjectId: projectId } = useSelectedProject()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateAirdropInput) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const airdropResponse = await createServiceAirdrop(input, projectId)

      const consoleResponse = await api.api.createJettonAirdrop(
        { project_id: projectId },
        {
          api_id: airdropResponse.id,
          name: input.name,
        },
        { format: "json" }
      )

      return consoleResponse.data.airdrop
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getAirdropsQueryKey(projectId),
      })
    },
  })
}

export function useUploadAirdropFileMutation() {
  const { selectedProjectId: projectId } = useSelectedProject()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UploadAirdropFileInput) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await uploadAirdropFile(input, projectId)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getAirdropsQueryKey(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: getAirdropDetailQueryKey(projectId, variables.id),
      })
    },
  })
}

export function useSwitchAirdropClaimMutation() {
  const { selectedProjectId: projectId } = useSelectedProject()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SwitchClaimInput) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await switchAirdropClaim(input, projectId)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getAirdropsQueryKey(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: getAirdropDetailQueryKey(projectId, variables.id),
      })
    },
  })
}
