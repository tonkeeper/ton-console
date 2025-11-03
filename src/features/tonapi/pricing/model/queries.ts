import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMaybeProject, useProjectId } from 'src/shared/contexts/ProjectContext';
import { useToast } from '@chakra-ui/react';
import {
    DTOTier,
    DTOAppTier,
    getTonApiTiers,
    getProjectTonApiTier,
    updateProjectTonApiTier,
    validChangeTonApiTier
} from 'src/shared/api';
import { UsdCurrencyAmount } from 'src/shared';
import { RestApiTier, RestApiSelectedTier } from './interfaces';

// Mappers
function mapTierToRestApiTier(tier: DTOTier): RestApiTier {
    // Convert price for 1K requests for pay-as-you-go tiers
    const usdPrice = tier.instant_payment ? tier.usd_price * 1000 : tier.usd_price;

    return {
        id: tier.id,
        name: tier.name,
        price: new UsdCurrencyAmount(usdPrice),
        rps: tier.rpc,
        type: tier.instant_payment ? 'pay-as-you-go' : 'monthly'
    };
}

function mapAppTierToSelectedTier(tier: DTOAppTier | null): RestApiSelectedTier | null {
    if (!tier) {
        return null;
    }

    const { id, name, rpc, usd_price, instant_payment, next_payment } = tier;
    const restApiTier = mapTierToRestApiTier({ id, name, rpc, usd_price, instant_payment });
    const renewsDate = next_payment && usd_price ? new Date(next_payment) : undefined;

    return {
        ...restApiTier,
        renewsDate,
        active: true
    };
}

// Query Hooks
export function useRestApiTiers() {
    return useQuery({
        queryKey: ['rest-api-tiers'],
        queryFn: async () => {
            const { data, error } = await getTonApiTiers();
            if (error) throw error;
            return data.items.map(mapTierToRestApiTier);
        },
        staleTime: 5 * 60 * 1000 // Tiers don't change often
    });
}

export function useSelectedRestApiTier() {
    const project = useMaybeProject();

    return useQuery({
        queryKey: ['selected-rest-api-tier', project?.id || undefined],
        queryFn: async () => {
            if (!project) return null;

            const { data, error } = await getProjectTonApiTier({
                query: { project_id: project.id }
            });
            if (error) throw error;

            return mapAppTierToSelectedTier(data.tier);
        },
        enabled: !!project,
        staleTime: 30 * 1000
    });
}

export function useRestApiSelectedTierQuery() {
    return useSelectedRestApiTier();
}

// Mutation Hooks
export function useSelectRestApiTierMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const toast = useToast();

    return useMutation({
        mutationFn: async (tierId: number) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { data, error } = await updateProjectTonApiTier({
                query: { project_id: currentProjectId },
                body: { tier_id: tierId }
            });
            if (error) throw error;

            return { tier: mapAppTierToSelectedTier(data.tier), _projectId: currentProjectId };
        },
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: ['selected-rest-api-tier', data._projectId]
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

export function useCheckValidChangeRestApiTierMutation() {
    const project = useMaybeProject();

    return useMutation({
        mutationFn: async (tierId: number) => {
            const currentProjectId = project?.id;
            if (!currentProjectId) throw new Error('Project not selected');

            const { data, error } = await validChangeTonApiTier({
                path: { id: tierId },
                query: { project_id: currentProjectId }
            });

            if (error) throw error;

            return data;
        }
    });
}
