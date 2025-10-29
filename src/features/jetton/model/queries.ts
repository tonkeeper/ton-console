import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Address, Cell, toNano } from '@ton/core';
import { JettonInfo, JettonBalance } from '@ton-api/client';
import { tonapiClient } from 'src/shared';
import { readJettonMetadata } from '../lib/jetton-minter';
import { createStandaloneToast } from '@chakra-ui/react';

/**
 * Query key factory for jetton queries
 */
const jettonKeys = {
  all: () => ['jetton'] as const,
  info: (jettonAddress: string | null) => [...jettonKeys.all(), 'info', jettonAddress] as const,
  wallet: (jettonAddress: string | null, walletAddress: string | null) =>
    [...jettonKeys.all(), 'wallet', jettonAddress, walletAddress] as const
};

/**
 * Fetch jetton info including blockchain metadata
 */
async function fetchJettonInfo(jettonAddress: Address): Promise<JettonInfo | null> {
  const jettonInfo = await tonapiClient.jettons.getJettonInfo(jettonAddress).catch((e) => {
    if (e.status === 404) {
      return null;
    }
    throw e;
  });

  if (!jettonInfo) {
    return null;
  }

  // Fetch blockchain metadata for more up-to-date info
  const jettonMetadataFromBlockchainContent = await tonapiClient.blockchain
    .execGetMethodForBlockchainAccount(jettonAddress, 'get_jetton_data')
    .then((v) => v.decoded.jetton_content)
    .then((v) => Cell.fromBoc(Buffer.from(v, 'hex')))
    .then(async (v) => {
      const pop = v.pop();
      return pop && (await readJettonMetadata(pop));
    })
    .then((v) => v?.metadata)
    .catch(() => null); // If blockchain fetch fails, use API data

  const preparedMetadataFromBlockchainContent: Partial<any> = {
    name: jettonMetadataFromBlockchainContent?.name,
    symbol: jettonMetadataFromBlockchainContent?.symbol,
    decimals: jettonMetadataFromBlockchainContent?.decimals,
    image: jettonMetadataFromBlockchainContent?.image,
    description: jettonMetadataFromBlockchainContent?.description
  };

  return {
    ...jettonInfo,
    metadata: {
      ...jettonInfo.metadata,
      ...preparedMetadataFromBlockchainContent
    }
  };
}

/**
 * Fetch jetton wallet balance for a specific address
 */
async function fetchJettonWallet(
  jettonAddress: Address,
  walletAddress: Address
): Promise<JettonBalance | null> {
  return tonapiClient.accounts
    .getAccountJettonBalance(walletAddress, jettonAddress)
    .catch((e) => {
      if (e.status === 404) return null;
      throw e;
    });
}

/**
 * Hook to fetch jetton info
 * @param jettonAddress - Jetton address or null to disable query
 */
export function useJettonInfoQuery(jettonAddress: Address | null) {
  return useQuery({
    queryKey: jettonKeys.info(jettonAddress?.toString() ?? null),
    queryFn: async () => {
      if (!jettonAddress) return null;
      return fetchJettonInfo(jettonAddress);
    },
    enabled: !!jettonAddress,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Hook to fetch jetton wallet balance
 * @param jettonAddress - Jetton address
 * @param walletAddress - Wallet address to check balance for
 */
export function useJettonWalletQuery(jettonAddress: Address | null, walletAddress: Address | null) {
  return useQuery({
    queryKey: jettonKeys.wallet(jettonAddress?.toString() ?? null, walletAddress?.toString() ?? null),
    queryFn: async () => {
      if (!jettonAddress || !walletAddress) return null;
      return fetchJettonWallet(jettonAddress, walletAddress);
    },
    enabled: !!jettonAddress && !!walletAddress,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Helper to wait for blockchain state change with polling
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForBlockchainChange<T>(
  fetcher: () => Promise<T>,
  waitConditionChecker: (v: T) => boolean,
  maxAttempts = 25,
  pollInterval = 3000
): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(pollInterval);
    const res = await fetcher();
    if (waitConditionChecker(res)) return;
  }
  throw new Error('Blockchain change confirmation timeout (75s)');
}

/**
 * Mutation hook for minting jettons
 */
export function useMintJettonMutation(jettonAddress: Address | null) {
  const queryClient = useQueryClient();
  const { toast } = createStandaloneToast();

  return useMutation({
    mutationFn: async ({
      amount,
      connectedWalletAddress,
      tonConnection,
      jettonWallet
    }: {
      amount: bigint;
      connectedWalletAddress: Address;
      tonConnection: any; // TonConnectUI type
      jettonWallet: any; // JettonBalance type
    }) => {
      if (!jettonAddress) throw new Error('Jetton address is not set');

      const { mintBody } = await import('../lib/jetton-minter');

      const supplyFetcher = async () =>
        fetchJettonInfo(jettonAddress).then((v) => (v ? BigInt(v.totalSupply) : null));

      const beforeTotalSupply = await supplyFetcher();

      if (!beforeTotalSupply) {
        throw new Error('Jetton cannot be existed');
      }

      const tx = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: jettonAddress.toString(),
            amount: toNano(0.031).toString(),
            stateInit: undefined,
            payload: mintBody(connectedWalletAddress, amount, toNano(0.02), 0n)
              .toBoc()
              .toString('base64')
          }
        ]
      };

      await tonConnection.sendTransaction(tx);

      // Wait for blockchain to update
      await waitForBlockchainChange(
        supplyFetcher,
        (v) => v === beforeTotalSupply + amount
      );

      return { jettonAddress };
    },
    onSuccess: (data) => {
      // Invalidate jetton info to force refetch
      if (data.jettonAddress) {
        queryClient.invalidateQueries({
          queryKey: jettonKeys.info(data.jettonAddress.toString())
        });
      }

      toast({
        title: 'Success',
        description: 'Jetton minted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        title: 'Tracking lost',
        description: 'Unknown tracking error happened',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
    }
  });
}

/**
 * Mutation hook for burning jettons
 */
export function useBurnJettonMutation(jettonAddress: Address | null) {
  const queryClient = useQueryClient();
  const { toast } = createStandaloneToast();

  return useMutation({
    mutationFn: async ({
      amount,
      connectedWalletAddress,
      tonConnection,
      jettonWallet
    }: {
      amount: bigint;
      connectedWalletAddress: Address;
      tonConnection: any; // TonConnectUI type
      jettonWallet: any; // JettonBalance type
    }) => {
      if (!jettonAddress) throw new Error('Jetton address is not set');

      const { burnBody } = await import('../lib/jetton-minter');

      const supplyFetcher = async () =>
        fetchJettonInfo(jettonAddress).then((v) => (v ? BigInt(v.totalSupply) : null));

      const beforeTotalSupply = await supplyFetcher();

      if (!beforeTotalSupply) {
        throw new Error('Jetton cannot be existed');
      }

      const jettonWalletAddress = jettonWallet.walletAddress.address;

      const tx = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: jettonWalletAddress.toString(),
            amount: toNano(0.031).toString(),
            stateInit: undefined,
            payload: burnBody(amount, connectedWalletAddress)
              .toBoc()
              .toString('base64')
          }
        ]
      };

      await tonConnection.sendTransaction(tx);

      // Wait for blockchain to update
      await waitForBlockchainChange(
        supplyFetcher,
        (v) => v === beforeTotalSupply - amount
      );

      return { jettonAddress };
    },
    onSuccess: (data) => {
      // Invalidate jetton info to force refetch
      if (data.jettonAddress) {
        queryClient.invalidateQueries({
          queryKey: jettonKeys.info(data.jettonAddress.toString())
        });
      }

      toast({
        title: 'Success',
        description: 'Jetton burned successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        title: 'Tracking lost',
        description: 'Unknown tracking error happened',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
    }
  });
}

/**
 * Mutation hook for burning admin rights
 */
export function useBurnAdminMutation(jettonAddress: Address | null) {
  const queryClient = useQueryClient();
  const { toast } = createStandaloneToast();

  return useMutation({
    mutationFn: async ({ tonConnection }: { tonConnection: any }) => {
      if (!jettonAddress) throw new Error('Jetton address is not set');

      const { changeAdminBody } = await import('../lib/jetton-minter');
      const { zeroAddress } = await import('../lib/utils');

      const supplyFetcher = async () =>
        fetchJettonInfo(jettonAddress).then((v) => v?.admin?.address ?? null);

      const tx = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: jettonAddress.toString(),
            amount: toNano(0.01).toString(),
            stateInit: undefined,
            payload: changeAdminBody(zeroAddress()).toBoc().toString('base64')
          }
        ]
      };

      await tonConnection.sendTransaction(tx);

      // Wait for blockchain to update
      await waitForBlockchainChange(
        supplyFetcher,
        (v) => v?.equals(zeroAddress()) ?? false
      );

      return { jettonAddress };
    },
    onSuccess: (data) => {
      // Invalidate jetton info to force refetch
      if (data.jettonAddress) {
        queryClient.invalidateQueries({
          queryKey: jettonKeys.info(data.jettonAddress.toString())
        });
      }

      toast({
        title: 'Success',
        description: 'Ownership revoked successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        title: 'Tracking lost',
        description: 'Unknown tracking error happened',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
    }
  });
}

/**
 * Mutation hook for updating jetton metadata
 */
export function useUpdateJettonMetadataMutation(jettonAddress: Address | null) {
  const queryClient = useQueryClient();
  const { toast } = createStandaloneToast();

  return useMutation({
    mutationFn: async ({
      metadata,
      tonConnection
    }: {
      metadata: any; // JettonMetadata type
      tonConnection: any; // TonConnectUI type
    }) => {
      if (!jettonAddress) throw new Error('Jetton address is not set');

      const { updateMetadataBody, buildJettonOnchainMetadata } = await import(
        '../lib/jetton-minter'
      );

      const supplyFetcher = async () =>
        fetchJettonInfo(jettonAddress).then((v) => (v ? v.metadata : null));

      const builtMetadata = await buildJettonOnchainMetadata(metadata);

      const tx = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: jettonAddress.toString(),
            amount: toNano(0.01).toString(),
            stateInit: undefined,
            payload: updateMetadataBody(builtMetadata).toBoc().toString('base64')
          }
        ]
      };

      await tonConnection.sendTransaction(tx);

      // Wait for blockchain to update
      await waitForBlockchainChange(supplyFetcher, (v) => {
        if (!v) return false;

        return (
          v.name === metadata.name &&
          v.symbol === metadata.symbol &&
          v.decimals === metadata.decimals &&
          v.image === metadata.image &&
          v.description === metadata.description
        );
      });

      return { jettonAddress };
    },
    onSuccess: (data) => {
      // Invalidate jetton info to force refetch
      if (data.jettonAddress) {
        queryClient.invalidateQueries({
          queryKey: jettonKeys.info(data.jettonAddress.toString())
        });
      }

      toast({
        title: 'Success',
        description: 'Jetton edited successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: () => {
      toast({
        title: 'Tracking lost',
        description: 'Unknown tracking error happened',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
    }
  });
}
