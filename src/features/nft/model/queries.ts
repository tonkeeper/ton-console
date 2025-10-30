import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Address } from '@ton/core';
import {
    getCNftConfig,
    getPaidCNftCollections,
    indexingCNftCollection,
    getInfoCNftCollectionAccount,
    DTOCnftCollection,
    DTOCnftIndexing
} from 'src/shared/api';
import { TonCurrencyAmount } from 'src/shared';
import { CnftCollection } from './interfaces/CnftCollection';

// Mappers
function mapDTOCnftCollectionToCnftCollection(dto: DTOCnftCollection): CnftCollection {
    return {
        ...dto,
        account: Address.parse(dto.account)
    };
}

// Query Hooks
export function useCNftConfig() {
    return useQuery({
        queryKey: ['cnft-config'],
        queryFn: async () => {
            const { data, error } = await getCNftConfig();
            if (error) throw error;
            return new TonCurrencyAmount(data.usd_price_per_nft);
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
}

export function useCNftHistory() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['cnft-history', projectId || undefined],
        queryFn: async () => {
            if (!projectId) return [];

            const { data, error } = await getPaidCNftCollections({
                query: { project_id: projectId }
            });

            if (error) throw error;
            return data.items.map(mapDTOCnftCollectionToCnftCollection);
        },
        enabled: !!projectId,
        staleTime: 30 * 1000
    });
}

export function useCNftAddressCheck() {
    return useMutation({
        mutationFn: async (addressString: string) => {
            // Don't call API for invalid addresses - let form validation handle it
            // This is just for checking if address exists on blockchain
            const { data, error } = await getInfoCNftCollectionAccount({
                path: { account: addressString }
            });

            if (error) throw error; // Throw network errors
            return data ? mapDTOCnftCollectionToCnftCollection(data) : null; // null = address not found
        }
    });
}

// Mutation Hooks
export function useAddCNftMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const toast = useToast();

    return useMutation({
        mutationFn: async (requestData: DTOCnftIndexing) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { error } = await indexingCNftCollection({
                query: { project_id: currentProjectId },
                body: requestData
            });

            if (error) throw error;

            return { _projectId: currentProjectId };
        },
        onSuccess: (data) => {
            // Invalidate cache to refetch the history
            queryClient.invalidateQueries({
                queryKey: ['cnft-history', data._projectId]
            });
            toast({
                title: 'cNFT added successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        },
        onError: (error) => {
            const axiosError = error as AxiosError;
            const response = axiosError.response?.data as { error: string } | undefined;

            toast({
                title: 'cNFT adding error',
                description: response?.error,
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    });
}

export type IndexingCnftCollectionDataT = DTOCnftIndexing;
