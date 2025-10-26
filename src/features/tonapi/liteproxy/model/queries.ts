import { useQuery } from '@tanstack/react-query';
import {
    getProjectLiteproxyTier,
    DTOProjectLiteproxyTierDetail
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';

const LITEPROXY_SELECTED_TIER_QUERY_KEY = ['liteproxy-selected-tier'] as const;

/**
 * Hook for fetching the selected liteproxy tier for the current project
 * Uses project change as a dependency for automatic refetch
 */
export function useLiteproxySelectedTierQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery<DTOProjectLiteproxyTierDetail | null>({
        queryKey: [...LITEPROXY_SELECTED_TIER_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectLiteproxyTier({
                query: { project_id: projectId }
            });

            if (error) throw error;

            return data.tier;
        },
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
}
