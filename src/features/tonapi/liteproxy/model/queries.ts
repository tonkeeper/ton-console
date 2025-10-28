import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import {
    DTOLiteproxyKey,
    DTOLiteproxyTier,
    DTOProjectLiteproxyTierDetail,
    getLiteproxyKeys,
    createLiteproxyKeys,
    getLiteproxyTiers,
    getProjectLiteproxyTier,
    updateLiteproxyTier,
    validChangeLiteproxyTier
} from 'src/shared/api';
import { useToast } from '@chakra-ui/react';

// Query Hooks
export function useLiteproxyList() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['liteproxy-list', projectId || undefined],
        queryFn: async () => {
            if (!projectId) return [];

            const { data, error } = await getLiteproxyKeys({
                query: { project_id: projectId }
            });

            if (error) {
                if (error.error === 'keys not found') return [];
                throw error;
            }

            return data.keys;
        },
        enabled: !!projectId,
        staleTime: 30 * 1000
    });
}

export function useLiteproxyTiers() {
    return useQuery({
        queryKey: ['liteproxy-tiers'],
        queryFn: async () => {
            const { data, error } = await getLiteproxyTiers();
            if (error) throw error;
            return data.tiers;
        },
        staleTime: 5 * 60 * 1000 // Tiers don't change often
    });
}

export function useSelectedLiteproxyTier() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['selected-liteproxy-tier', projectId || undefined],
        queryFn: async () => {
            if (!projectId) return null;

            const { data, error } = await getProjectLiteproxyTier({
                query: { project_id: projectId }
            });

            if (error) throw error;
            return data.tier;
        },
        enabled: !!projectId,
        staleTime: 30 * 1000
    });
}

// Legacy export for backward compatibility
export function useLiteproxySelectedTierQuery() {
    return useSelectedLiteproxyTier();
}

// Mutation Hooks
export function useCreateLiteproxyMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const toast = useToast();

    return useMutation({
        mutationFn: async () => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { data, error } = await createLiteproxyKeys({
                query: { project_id: currentProjectId }
            });

            if (error) throw error;
            return { keys: data.keys, _projectId: currentProjectId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['liteproxy-list', data._projectId]
            });
            toast({
                title: 'Api key has been created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: "Api key wasn't created",
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    });
}

export function useSelectLiteproxyTierMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const toast = useToast();

    return useMutation({
        mutationFn: async (tierId: number) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { error } = await updateLiteproxyTier({
                query: { project_id: currentProjectId },
                body: { tier_id: tierId }
            });

            if (error) throw error;
            return { tierId, _projectId: currentProjectId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['selected-liteproxy-tier', data._projectId]
            });
            toast({
                title: 'Successful purchase',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Unsuccessful purchase',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    });
}

export function useCheckValidChangeLiteproxyTierMutation() {
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (tierId: number) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { data, error } = await validChangeLiteproxyTier({
                path: { id: tierId },
                query: { project_id: currentProjectId }
            });

            if (error) throw error;
            return data;
        }
    });
}
