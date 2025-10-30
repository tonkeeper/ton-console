import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { getTestnetAvailable, buyTestnetCoins } from 'src/shared/api';
import { hasProperty, testnetExplorer, TonCurrencyAmount } from 'src/shared';
import { tonapiTestnet } from 'src/shared/api/tonapi';
import { RequestFaucetForm } from './interfaces';

// Mapper
function mapTestnetAvailableData(data: { balance: number; usd_per_testnet_ton: number }) {
    return {
        tonSupply: new TonCurrencyAmount(data.balance),
        tonRate: data.usd_per_testnet_ton
    };
}

// Helper function to fetch tx hash with retries
async function fetchTxHash(msgHash: string, attempt = 0): Promise<string> {
    return tonapiTestnet.blockchain
        .getBlockchainTransactionByMessageHash(msgHash)
        .then(data => data.hash)
        .catch(e => {
            if (hasProperty(e, 'message') && e.message === 'transaction not found') {
                if (attempt > 20) {
                    throw new Error('Tx not found');
                }
                return new Promise(r => setTimeout(r, 1500)).then(() =>
                    fetchTxHash(msgHash, attempt + 1)
                );
            }

            throw e;
        });
}

// Query Hooks
export function useFaucetSupplyAndRate() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: ['faucet-supply-rate', projectId || undefined],
        queryFn: async () => {
            const { data, error } = await getTestnetAvailable();
            if (error) throw error;
            return mapTestnetAvailableData(data);
        },
        enabled: !!projectId,
        staleTime: 30 * 1000 // 30 seconds
    });
}

// Mutation Hooks
export function useBuyTestnetCoinsMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const toast = useToast();

    return useMutation({
        mutationFn: async (form: RequestFaucetForm) => {
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project not selected');

            const { data, error } = await buyTestnetCoins({
                query: { project_id: currentProjectId },
                body: { address: form.receiverAddress, coins: form.amount.weiAmount.toNumber() }
            });

            if (error) throw error;

            // Fetch transaction hash with retries
            const hash = await fetchTxHash(data.hash);

            // Refetch supply after purchase
            await queryClient.invalidateQueries({
                queryKey: ['faucet-supply-rate', currentProjectId]
            });

            return {
                amount: form.amount,
                link: testnetExplorer.transactionLink(hash),
                _projectId: currentProjectId
            };
        },
        onSuccess: (_data) => {
            toast({
                title: 'Successfully bought testnet assets',
                status: 'success',
                isClosable: true,
                duration: 3000
            });
        },
        onError: (error) => {
            let title = 'Unknown error';
            let description = 'Unknown api error happened. Try again later';

            const axiosError = error as AxiosError<{ code: number }>;
            if (axiosError?.response?.data?.code === 3) {
                title = 'Only one request per minute is allowed';
                description = 'Please wait few minutes and try again';
            }

            toast({
                title,
                description,
                status: 'error',
                isClosable: true,
                duration: 3000
            });
        }
    });
}

export type { RequestFaucetForm };
