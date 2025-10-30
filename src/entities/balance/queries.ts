import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDepositAddress, GetDepositAddressResponse, promoCodeDepositProject } from "src/shared/api";
import { useProjectId } from "src/shared/contexts/ProjectContext";

const DEPOSIT_ADDRESS_QUERY_KEY = 'deposit-address';
const BALANCE_QUERY_KEY = 'balance';

/**
 * Global hook for fetching deposit addresses
 * Used in refill modals
 */
export function useDepositAddressQuery() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: [DEPOSIT_ADDRESS_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getDepositAddress({
                path: { id: projectId }
            });

            if (error) throw error;

            return data as GetDepositAddressResponse;
        },
        enabled: !!projectId,
        staleTime: 10 * 60 * 1000 // Cache for 10 minutes
    });
}


/**
 * Mutation for applying promo codes
 * Auto-updates balance cache on success
 */
export function useApplyPromoCodeMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();

    return useMutation({
        mutationFn: async (promoCode: string) => {
            if (!projectId) throw new Error('No project selected');

            const { error } = await promoCodeDepositProject({
                path: { id: projectId, promo_code: promoCode }
            });

            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate balance cache to refetch immediately
            queryClient.invalidateQueries({
                queryKey: [BALANCE_QUERY_KEY, projectId]
            });
        }
    });
}
