import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { DTOGetProjectTonApiStatsParamsDashboardEnum } from "@/api/api.generated"
import { api } from "@/api/client"
import { webhooksApi } from "@/api/webhooks-client"
import { useSelectedProject } from "@/hooks/use-project"

import type { WebhookNetwork } from "./webhook-types"
import { getWebhookStatsRange, type WebhookStatsPeriod } from "./webhook-utils"

const WEBHOOKS_QUERY_KEY = ["tonapi", "webhooks"] as const

function getWebhooksQueryKey(
  projectId: number | null | undefined,
  network: WebhookNetwork
) {
  return [...WEBHOOKS_QUERY_KEY, "list", projectId, network] as const
}

function getAccountsQueryKey(
  projectId: number | null | undefined,
  webhookId: number | null | undefined,
  network: WebhookNetwork,
  offset = 0,
  limit = 1000
) {
  return [
    ...WEBHOOKS_QUERY_KEY,
    "accounts",
    projectId,
    network,
    webhookId,
    offset,
    limit,
  ] as const
}

function getOpcodesQueryKey(
  projectId: number | null | undefined,
  webhookId: number | null | undefined,
  network: WebhookNetwork
) {
  return [
    ...WEBHOOKS_QUERY_KEY,
    "opcodes",
    projectId,
    network,
    webhookId,
  ] as const
}

function getLogsQueryKey(
  projectId: number | null | undefined,
  webhookId: number | null | undefined,
  network: WebhookNetwork,
  offset = 0
) {
  return [
    ...WEBHOOKS_QUERY_KEY,
    "logs",
    projectId,
    network,
    webhookId,
    offset,
  ] as const
}

function getStatsQueryKey(
  projectId: number | null | undefined,
  network: WebhookNetwork,
  period: WebhookStatsPeriod
) {
  return [...WEBHOOKS_QUERY_KEY, "stats", projectId, network, period] as const
}

function getWebhookQuery(projectId: number, network: WebhookNetwork) {
  return {
    project_id: String(projectId),
    network,
  }
}

function invalidateWebhookDetail(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: number,
  network: WebhookNetwork,
  webhookId: number
) {
  queryClient.invalidateQueries({
    queryKey: getWebhooksQueryKey(projectId, network),
  })
  queryClient.invalidateQueries({
    queryKey: [
      ...WEBHOOKS_QUERY_KEY,
      "accounts",
      projectId,
      network,
      webhookId,
    ],
  })
  queryClient.invalidateQueries({
    queryKey: getOpcodesQueryKey(projectId, webhookId, network),
  })
  queryClient.invalidateQueries({
    queryKey: [...WEBHOOKS_QUERY_KEY, "logs", projectId, network, webhookId],
  })
  queryClient.invalidateQueries({
    queryKey: [...WEBHOOKS_QUERY_KEY, "stats", projectId, network],
  })
}

export function useWebhooksQuery(network: WebhookNetwork) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getWebhooksQueryKey(projectId, network),
    enabled: Boolean(projectId),
    retry: (failureCount, error) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        (error as { status?: number }).status === 501
      ) {
        return false
      }

      return failureCount < 1
    },
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await webhooksApi.webhooks.getWebhooks(
        getWebhookQuery(projectId, network)
      )

      return response.data.webhooks.toSorted((a, b) => b.id - a.id)
    },
    staleTime: 60 * 1000,
  })
}

export function useWebhookStatsQuery(
  network: WebhookNetwork,
  period: WebhookStatsPeriod = "last_6h"
) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getStatsQueryKey(projectId, network, period),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const { start, end, step } = getWebhookStatsRange(period)
      const response = await api.api.getProjectTonApiStats(
        {
          project_id: projectId,
          start,
          end,
          step,
          dashboard:
            DTOGetProjectTonApiStatsParamsDashboardEnum.DTOTonapiWebhook,
        },
        { format: "json" }
      )

      return response.data.stats
    },
    staleTime: 30 * 1000,
  })
}

export function useWebhookAccountSubscriptionsQuery(
  webhookId: number | null,
  network: WebhookNetwork,
  offset = 0,
  limit = 1000
) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getAccountsQueryKey(projectId, webhookId, network, offset, limit),
    enabled: Boolean(projectId && webhookId),
    queryFn: async () => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      const response = await webhooksApi.webhooks.webhookAccountTxSubscriptions(
        webhookId,
        {
          ...getWebhookQuery(projectId, network),
          limit,
          offset,
        }
      )

      return response.data.account_tx_subscriptions
    },
    staleTime: 60 * 1000,
  })
}

export function useWebhookOpcodeSubscriptionsQuery(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getOpcodesQueryKey(projectId, webhookId, network),
    enabled: Boolean(projectId && webhookId),
    queryFn: async () => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      const response =
        await webhooksApi.webhooks.webhookNewContractsSubscriptions(webhookId, {
          ...getWebhookQuery(projectId, network),
          limit: 1000,
          offset: 0,
        })

      return response.data.subscriptions
    },
    staleTime: 60 * 1000,
  })
}

export function useWebhookFailureLogsQuery(
  webhookId: number | null,
  network: WebhookNetwork,
  offset = 0
) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getLogsQueryKey(projectId, webhookId, network, offset),
    enabled: Boolean(projectId && webhookId),
    queryFn: async () => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      const response = await webhooksApi.webhooks.getFailureLogs(webhookId, {
        ...getWebhookQuery(projectId, network),
        offset,
      })

      return response.data
    },
    staleTime: 30 * 1000,
  })
}

export function useCreateWebhookMutation(network: WebhookNetwork) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (endpoint: string) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await webhooksApi.webhooks.createWebhook(
        { endpoint },
        getWebhookQuery(projectId, network)
      )

      return { ...response.data, projectId }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: getWebhooksQueryKey(result.projectId, network),
      })
      queryClient.invalidateQueries({
        queryKey: [...WEBHOOKS_QUERY_KEY, "stats", result.projectId, network],
      })
    },
  })
}

export function useDeleteWebhookMutation(network: WebhookNetwork) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (webhookId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await webhooksApi.webhooks.deleteWebhook(
        webhookId,
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useRegenerateWebhookTokenMutation(network: WebhookNetwork) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (webhookId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await webhooksApi.webhooks.webhookGenerateNewToken(
        webhookId,
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId, token: response.data.token }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: getWebhooksQueryKey(result.projectId, network),
      })
    },
  })
}

export function useBackOnlineMutation(network: WebhookNetwork) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (webhookId: number) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await webhooksApi.webhooks.webhookBackOnline(
        webhookId,
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useAddAccountSubscriptionsMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (accounts: string[]) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      await webhooksApi.webhooks.webhookAccountTxSubscribe(
        webhookId,
        {
          accounts: accounts.map((accountId) => ({ account_id: accountId })),
        },
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useRemoveAccountSubscriptionMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (accountId: string) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      await webhooksApi.webhooks.webhookAccountTxUnsubscribe(
        webhookId,
        { accounts: [accountId] },
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useToggleMempoolSubscriptionMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      if (enabled) {
        await webhooksApi.webhooks.webhookMempoolSubscribe(
          webhookId,
          getWebhookQuery(projectId, network)
        )
      } else {
        await webhooksApi.webhooks.webhookMempoolUnsubscribe(
          webhookId,
          getWebhookQuery(projectId, network)
        )
      }

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useToggleNewContractsSubscriptionMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      if (enabled) {
        await webhooksApi.webhooks.webhookNewContractSubscribe(
          webhookId,
          getWebhookQuery(projectId, network)
        )
      } else {
        await webhooksApi.webhooks.webhookNewContractUnsubscribe(
          webhookId,
          getWebhookQuery(projectId, network)
        )
      }

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useAddOpcodeSubscriptionMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (opcode: string) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      await webhooksApi.webhooks.webhookMsgOpcodeSubscribe(
        webhookId,
        opcode,
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}

export function useRemoveOpcodeSubscriptionMutation(
  webhookId: number | null,
  network: WebhookNetwork
) {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (opcode: string) => {
      if (!projectId || !webhookId) {
        throw new Error("No webhook selected")
      }

      await webhooksApi.webhooks.webhookMsgOpcodeUnsubscribe(
        webhookId,
        opcode,
        getWebhookQuery(projectId, network)
      )

      return { webhookId, projectId }
    },
    onSuccess: (result) => {
      invalidateWebhookDetail(
        queryClient,
        result.projectId,
        network,
        result.webhookId
      )
    },
  })
}
