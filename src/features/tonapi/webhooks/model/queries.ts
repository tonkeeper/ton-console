import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMaybeProject, useProjectId } from 'src/shared/contexts/ProjectContext';
import {
  rtTonApiClient,
  RTWebhookAccountTxSubscriptions
} from 'src/shared/api/streaming-api';
import { getProjectTonApiStats, DTOStats } from 'src/shared/api';
import { CreateWebhookForm } from './interfaces';
import { Address } from '@ton/core';
import { Network } from 'src/shared';
import { ChartPoint, TimePeriod } from '../../statistics/model/queries';
import { getPeriodConfig, getTimestampRange } from '../../statistics/model/time-periods';

export type Subscription = RTWebhookAccountTxSubscriptions['account_tx_subscriptions'][0];

const WEBHOOKS_KEYS = {
  all: ['webhooks'],
  list: (projectId: number | undefined, network: Network) => ['webhooks', projectId, network],
  stats: (projectId: number | undefined) => ['webhooks', 'stats', projectId],
  subscriptions: (projectId: number | undefined, webhookId: number, page: number) => ['webhooks', 'subscriptions', projectId, webhookId, page]
};

// Mappers
// TODO: CRITICAL BUG INVESTIGATION NEEDED
// The DTOStats type has metric: { operation?: string }, but this function filters by metric.type
// which doesn't exist in the type definition. This suggests either:
// 1. The API response format for webhook stats is different than general DTOStats
// 2. The DTOStats type definition is incomplete/incorrect for this endpoint
// The type assertion `as unknown as` was hiding this mismatch. Please verify actual API response.
export function mapWebhooksStatsToChartPoints(
  stats: DTOStats,
  type: 'delivered' | 'failed'
): ChartPoint[] {
  const items = stats.result
    .filter(item => {
      // NOTE: Accessing metric.type even though DTOStats defines metric.operation
      // This will likely return undefined and filter out all items until fixed
      const metricType = (item.metric as unknown as Record<string, string>)?.type;
      return metricType === type;
    })
    .flatMap(item => {
      const values = item.values as [number, string | null][];
      return values.map(([timestamp, value]) => ({
        time: timestamp * 1000,
        value: value == null ? undefined : parseFloat(value)
      }));
    });

  return items;
}

/**
 * Fetch all webhooks for a project
 * Returns empty array if no project selected
 * Returns error state if webhooks feature is not available (501 error)
 */
export function useWebhooksQuery(network: Network) {
  const project = useMaybeProject();

  return useQuery({
    queryKey: WEBHOOKS_KEYS.list(project?.id, network),
    queryFn: async () => {
      if (!project) return [];
      const response = await rtTonApiClient.webhooks.getWebhooks({
        project_id: project.id.toString(),
        network
      });
      return response.data.webhooks.toSorted((a, b) => b.id - a.id);
    },
    enabled: !!project,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 501 - feature is not available
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 501) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 1;
    }
  });
}

/**
 * Fetch webhook stats
 */
export function useWebhooksStatsQuery(period: TimePeriod = 'last_6h') {
  const projectId = useProjectId();
  const config = getPeriodConfig(period);
  const { start, end } = getTimestampRange(period);

  return useQuery({
    queryKey: [...WEBHOOKS_KEYS.stats(projectId || undefined), period],
    queryFn: async () => {
      if (!projectId) return null;

      const { data, error } = await getProjectTonApiStats({
        query: {
          project_id: projectId,
          start,
          end,
          step: config.stepSeconds,
          dashboard: 'tonapi_webhook'
        }
      });

      if (error) throw error;

      return data.stats as DTOStats;
    },
    enabled: !!projectId,
    staleTime: 30 * 1000 // Aligned with other stats (30 seconds)
  });
}

/**
 * Fetch subscriptions for a webhook
 */
export function useWebhookSubscriptionsQuery(
  webhookId: number | null,
  page: number,
  limit = 20
) {
  const projectId = useProjectId();

  return useQuery({
    queryKey: WEBHOOKS_KEYS.subscriptions(projectId || undefined, webhookId || 0, page),
    queryFn: async () => {
      if (!webhookId || !projectId) return [];

      const offset = (page - 1) * limit;

      const response = await rtTonApiClient.webhooks.webhookAccountTxSubscriptions(webhookId, {
        project_id: projectId.toString(),
        network: 'mainnet',
        limit,
        offset
      });

      return response.data.account_tx_subscriptions;
    },
    enabled: !!webhookId && !!projectId,
    staleTime: 1 * 60 * 1000 // 1 minute
  });
}

/**
 * Create a new webhook
 */
export function useCreateWebhookMutation(network: Network) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async ({ endpoint }: CreateWebhookForm) => {
      // Capture projectId at mutation time to prevent race conditions
      // if user switches project during network request
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      const response = await rtTonApiClient.webhooks.createWebhook(
        { endpoint },
        { project_id: currentProjectId.toString(), network }
      );

      return { ...response.data, _projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Use projectId from mutation result, not from hook closure
      // This ensures we invalidate the correct cache even if projectId changed
      const responseProjectId = (data as { _projectId: number })._projectId;
      if (responseProjectId) {
        queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEYS.list(responseProjectId, network) });
      }
    }
  });
}

/**
 * Delete a webhook
 */
export function useDeleteWebhookMutation(network: Network) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (webhookId: number) => {
      // Capture projectId at mutation time
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      await rtTonApiClient.webhooks.deleteWebhook(webhookId, {
        project_id: currentProjectId.toString(),
        network
      });

      return { webhookId, projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Use projectId from mutation result
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEYS.list(data.projectId, network) });
    }
  });
}

/**
 * Add subscriptions to a webhook
 */
export function useAddSubscriptionsMutation(webhookId: number, network: Network) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (accounts: Address[]) => {
      // Capture projectId at mutation time to prevent race conditions
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      await rtTonApiClient.webhooks.webhookAccountTxSubscribe(
        webhookId,
        {
          accounts: accounts.map(account => ({ account_id: account.toRawString() }))
        },
        {
          project_id: currentProjectId.toString(),
          network
        }
      );

      return { webhookId, projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Refetch subscriptions with correct projectId from mutation result
      queryClient.invalidateQueries({
        queryKey: WEBHOOKS_KEYS.subscriptions(data.projectId, data.webhookId, 1)
      });
    }
  });
}

/**
 * Unsubscribe accounts from webhook
 */
export function useUnsubscribeWebhookMutation(webhookId: number, network: Network) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (accounts: Address[]) => {
      // Capture projectId at mutation time to prevent race conditions
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      await rtTonApiClient.webhooks.webhookAccountTxUnsubscribe(
        webhookId,
        {
          accounts: accounts.map(account => account.toRawString())
        },
        {
          project_id: currentProjectId.toString(),
          network
        }
      );

      return { webhookId, projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Invalidate subscriptions with correct projectId from mutation result
      queryClient.invalidateQueries({
        queryKey: WEBHOOKS_KEYS.subscriptions(data.projectId, data.webhookId, 1)
      });
    }
  });
}

/**
 * Bring webhook back online
 */
export function useBackWebhookToOnlineMutation(network: Network) {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  return useMutation({
    mutationFn: async (webhookId: number) => {
      // Capture projectId at mutation time
      const currentProjectId = projectId;
      if (!currentProjectId) throw new Error('Project not selected');

      await rtTonApiClient.webhooks.webhookBackOnline(webhookId, {
        project_id: currentProjectId.toString(),
        network
      });

      return { webhookId, projectId: currentProjectId };
    },
    onSuccess: (data) => {
      // Use projectId from mutation result
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEYS.list(data.projectId, network) });
    }
  });
}
