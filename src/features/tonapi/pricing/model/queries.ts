import { useQuery } from '@tanstack/react-query';
import {
    getProjectTonApiTier,
    DTOAppTier
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import { UsdCurrencyAmount } from 'src/shared';
import { RestApiSelectedTier } from './interfaces';

const REST_API_SELECTED_TIER_QUERY_KEY = ['rest-api-selected-tier'] as const;

/**
 * Hook for fetching the selected REST API tier for the current project
 * Uses project change as a dependency for automatic refetch
 */
export function useRestApiSelectedTierQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery<RestApiSelectedTier | null>({
        queryKey: [...REST_API_SELECTED_TIER_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectTonApiTier({
                query: { project_id: projectId }
            });

            if (error) throw error;

            return mapAppTierToSelectedTier(data.tier);
        },
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });
}

function mapAppTierToSelectedTier(tier: DTOAppTier | null): RestApiSelectedTier | null {
    if (!tier) {
        return null;
    }

    const nextPayment = tier.next_payment;
    const usdPrice = tier.usd_price;
    const renewsDate = nextPayment && usdPrice ? new Date(nextPayment) : undefined;

    return {
        id: tier.id,
        name: tier.name,
        price: new UsdCurrencyAmount(usdPrice),
        rps: tier.rpc,
        type: tier.instant_payment ? 'pay-as-you-go' : 'monthly',
        renewsDate,
        active: true
    };
}
