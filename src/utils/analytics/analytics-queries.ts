import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  DTOChain,
  DTOStatsQueryStatus,
  DTOStatsQueryType,
  type DTOStatsEstimateQuery,
  type DTOStatsQueryResult,
} from "@/api/api.generated"
import { api } from "@/api/client"

export type AnalyticsChain = "mainnet" | "testnet"

export const analyticsQueryKeys = {
  ddl: (chain: AnalyticsChain) => ["analytics", "ddl", chain] as const,
  history: (
    projectId: number | null,
    chain: AnalyticsChain | undefined,
    type?: DTOStatsQueryType[],
    onlyRepeating?: boolean
  ) =>
    [
      "analytics",
      "history",
      projectId,
      chain ?? "default",
      type,
      onlyRepeating,
    ] as const,
  historyProject: (projectId: number | null) =>
    ["analytics", "history", projectId] as const,
  result: (queryId: string | null) => ["analytics", "result", queryId] as const,
  gptPrice: (projectId: number | null) =>
    ["analytics", "gpt-price", projectId] as const,
}

function toDtoChain(chain: AnalyticsChain) {
  return chain === "testnet" ? DTOChain.DTOTestnet : DTOChain.DTOMainnet
}

export function useStatsDdlQuery(chain: AnalyticsChain) {
  return useQuery({
    queryKey: analyticsQueryKeys.ddl(chain),
    queryFn: async () => {
      const response = await api.api.getStatsDdl(
        { chain: toDtoChain(chain) },
        { format: "text" }
      )

      return String(response.data ?? "")
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useStatsHistoryQuery(
  projectId: number | null,
  chain: AnalyticsChain | undefined,
  {
    type,
    onlyRepeating,
  }: {
    type?: DTOStatsQueryType[]
    onlyRepeating?: boolean
  } = {}
) {
  return useInfiniteQuery({
    queryKey: analyticsQueryKeys.history(projectId, chain, type, onlyRepeating),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!projectId) {
        return { count: 0, items: [] as DTOStatsQueryResult[] }
      }

      const response = await api.api.getSqlHistoryFromStats(
        {
          project_id: projectId,
          limit: 20,
          offset: pageParam,
          type,
          is_repetitive: onlyRepeating || undefined,
          ...(chain ? { chain: toDtoChain(chain) } : {}),
        },
        { format: "json" }
      )

      return response.data
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (count, page) => count + page.items.length,
        0
      )

      return loadedCount < lastPage.count ? loadedCount : undefined
    },
    enabled: Boolean(projectId),
    staleTime: 30 * 1000,
  })
}

export function useStatsGptPriceQuery(projectId: number | null) {
  return useQuery({
    queryKey: analyticsQueryKeys.gptPrice(projectId),
    queryFn: async () => {
      if (!projectId) {
        return null
      }

      const response = await api.api.getStatsChatGptPrice(
        { project_id: projectId },
        { format: "json" }
      )

      return response.data
    },
    enabled: Boolean(projectId),
    staleTime: 30 * 1000,
  })
}

export function useStatsResultQuery(queryId: string | null) {
  return useQuery({
    queryKey: analyticsQueryKeys.result(queryId),
    queryFn: async () => {
      if (!queryId) {
        return null
      }

      const response = await api.api.getSqlResultFromStats(queryId, {
        format: "json",
      })

      return response.data
    },
    enabled: Boolean(queryId),
    refetchInterval: (query) =>
      query.state.data?.status === DTOStatsQueryStatus.DTOExecuting
        ? 1500
        : false,
  })
}

export function useEstimateStatsQueryMutation(projectId: number | null) {
  return useMutation({
    mutationFn: async ({
      sql,
      chain,
    }: {
      sql: string
      chain: AnalyticsChain
    }) => {
      if (!projectId) {
        throw new Error("Select a project before estimating a query.")
      }

      const response = await api.api.estimateStatsQuery(
        {
          project_id: projectId,
          query: sql,
        },
        { chain: toDtoChain(chain) },
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useSendStatsQueryMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sql,
      chain,
      estimate,
      gptMessage,
    }: {
      sql: string
      chain: AnalyticsChain
      estimate?: DTOStatsEstimateQuery
      gptMessage?: string
    }) => {
      if (!projectId) {
        throw new Error("Select a project before running a query.")
      }

      const response = await api.api.sendQueryToStats(
        {
          project_id: projectId,
          query: sql,
          gpt_message: gptMessage,
        },
        { chain: toDtoChain(chain) },
        { format: "json" }
      )

      return {
        ...response.data,
        estimate: response.data.estimate ?? estimate,
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData(analyticsQueryKeys.result(result.id), result)
      queryClient.invalidateQueries({
        queryKey: analyticsQueryKeys.historyProject(projectId),
      })
    },
  })
}

export function useGenerateStatsGptSqlMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      message,
      context,
      chain,
    }: {
      message: string
      context?: string
      chain: AnalyticsChain
    }) => {
      if (!projectId) {
        throw new Error("Select a project before generating SQL.")
      }

      const response = await api.api.statsChatGptRequest(
        {
          project_id: projectId,
          chain: toDtoChain(chain),
        },
        {
          message,
          context: context || undefined,
        },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: analyticsQueryKeys.gptPrice(projectId),
      })
    },
  })
}

export function useCreateStatsGraphMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      addresses,
      onlyBetween,
      chain,
    }: {
      addresses: string[]
      onlyBetween: boolean
      chain: AnalyticsChain
    }) => {
      if (!projectId) {
        throw new Error("Select a project before creating a graph.")
      }

      const response = await api.api.getGraphFromStats(
        {
          project_id: projectId,
          addresses: addresses.join(","),
          only_between: onlyBetween,
          chain: toDtoChain(chain),
        },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: (result) => {
      queryClient.setQueryData(analyticsQueryKeys.result(result.id), result)
      queryClient.invalidateQueries({
        queryKey: analyticsQueryKeys.historyProject(projectId),
      })
    },
  })
}

export function useUpdateStatsQueryMutation(projectId: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      repeatInterval,
    }: {
      id: string
      repeatInterval: number
    }) => {
      if (!projectId) {
        throw new Error("Select a project before updating a query.")
      }

      const response = await api.api.updateStatsQuery(
        id,
        { project_id: projectId },
        { repeat_interval: repeatInterval },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: (query, variables) => {
      queryClient.setQueryData<DTOStatsQueryResult | null>(
        analyticsQueryKeys.result(variables.id),
        (result) =>
          result
            ? {
                ...result,
                query: {
                  ...result.query,
                  ...query,
                },
              }
            : result
      )
      queryClient.invalidateQueries({
        queryKey: analyticsQueryKeys.historyProject(projectId),
      })
    },
  })
}
