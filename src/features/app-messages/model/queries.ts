import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMessagesPackages,
    getProjectMessagesBalance,
    getProjectMessagesStats,
    buyMessagesPackage,
    getProjectMessagesAppToken,
    regenerateProjectMessagesAppToken,
    DTOMessagesPackage
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { createStandaloneToast } from '@chakra-ui/react';
import { UsdCurrencyAmount } from 'src/shared';
import { AppMessagesPackage } from './interfaces';

/**
 * Query key factory for messages queries
 */
const appMessagesKeys = {
    all: () => ['messages'] as const,
    packages: () => [...appMessagesKeys.all(), 'packages'] as const,
    balance: (projectId: number | null | undefined) =>
        [...appMessagesKeys.all(), 'balance', projectId] as const,
    stats: (appId: number | null | undefined) =>
        [...appMessagesKeys.all(), 'stats', appId] as const,
    token: (appId: number | null | undefined) =>
        [...appMessagesKeys.all(), 'token', appId] as const
};

/**
 * Map DTO to domain model
 */
function mapDTOPackageToAppMessagesPackage(dtoPackage: DTOMessagesPackage): AppMessagesPackage {
    return {
        messagesIncluded: dtoPackage.limits,
        price: new UsdCurrencyAmount(dtoPackage.usd_price),
        name: dtoPackage.name,
        id: dtoPackage.id
    };
}

/**
 * Hook to fetch available messages packages (global, no projectId dependency)
 */
export function usePackagesQuery() {
    return useQuery({
        queryKey: appMessagesKeys.packages(),
        queryFn: async () => {
            const { data, error } = await getMessagesPackages();
            if (error) throw error;
            return data.items.map(mapDTOPackageToAppMessagesPackage);
        },
        staleTime: 10 * 60 * 1000 // 10 minutes - static data
    });
}

/**
 * Hook to fetch messages balance for current project
 */
export function useBalanceQuery() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: appMessagesKeys.balance(projectId),
        queryFn: async () => {
            if (!projectId) return 0;
            const { data, error } = await getProjectMessagesBalance({
                query: { project_id: projectId }
            });
            if (error) throw error;
            return data.balance;
        },
        enabled: !!projectId,
        staleTime: 1 * 60 * 1000 // 1 minute
    });
}

/**
 * Hook to fetch messages statistics for a dapp
 */
export function useStatsQuery(appId: number | null) {
    const projectId = useProjectId();

    return useQuery({
        queryKey: appMessagesKeys.stats(appId),
        queryFn: async () => {
            if (!appId || !projectId) return null;
            const { data, error } = await getProjectMessagesStats({
                query: { app_id: appId }
            });
            if (error) throw error;
            return {
                totalUsers: data.stats.users,
                usersWithEnabledNotifications: data.stats.enable_notifications,
                sentNotificationsLastWeek: data.stats.sent_in_week
            };
        },
        enabled: !!appId && !!projectId,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
}

/**
 * Hook to fetch dapp token for authentication
 */
export function useTokenQuery(appId: number | null) {
    const projectId = useProjectId();

    return useQuery({
        queryKey: appMessagesKeys.token(appId),
        queryFn: async () => {
            if (!appId || !projectId) return null;
            const { data, error } = await getProjectMessagesAppToken({
                query: { app_id: appId }
            });
            if (error) throw error;
            return data.token;
        },
        enabled: !!appId && !!projectId,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
}

/**
 * Mutation hook for buying messages package
 */
export function useBuyPackageMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (packageId: AppMessagesPackage['id']): Promise<{ _projectId: number }> => {
            const currentProjectId = projectId; // Capture at mutation time
            if (!currentProjectId) throw new Error('Project not selected');

            const { error } = await buyMessagesPackage({
                query: { project_id: currentProjectId },
                body: { id: packageId }
            });

            if (error) throw error;

            return { _projectId: currentProjectId };
        },
        onSuccess: (data) => {
            // Invalidate balance to force refetch
            queryClient.invalidateQueries({
                queryKey: appMessagesKeys.balance(data._projectId)
            });

            createStandaloneToast().toast({
                title: 'Successful purchase',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        },
        onError: () => {
            createStandaloneToast().toast({
                title: 'Unsuccessful purchase',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    });
}

/**
 * Mutation hook for regenerating dapp token
 */
export function useRegenerateDappTokenMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (appId: number): Promise<{ _appId: number; _projectId: number }> => {
            const currentProjectId = projectId; // Capture at mutation time
            if (!currentProjectId) throw new Error('Project not selected');

            const { error } = await regenerateProjectMessagesAppToken({
                query: { app_id: appId }
            });

            if (error) throw error;

            return { _appId: appId, _projectId: currentProjectId };
        },
        onSuccess: (data) => {
            // Invalidate token to force refetch
            queryClient.invalidateQueries({
                queryKey: appMessagesKeys.token(data._appId)
            });

            createStandaloneToast().toast({
                title: 'Token regenerated successfully',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        },
        onError: () => {
            createStandaloneToast().toast({
                title: 'Token regeneration error',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    });
}
