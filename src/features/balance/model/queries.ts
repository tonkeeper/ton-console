import { useQuery } from '@tanstack/react-query';
import {
    getProjectBillingHistory,
    DTOBalance
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import { tonapiMainnet, toDecimals } from 'src/shared';
import { Balance } from './interfaces';

const BALANCE_QUERY_KEY = ['balance'] as const;
const TON_RATE_QUERY_KEY = ['ton-rate'] as const;

const USDT_DECIMALS = 6;
const TON_DECIMALS = 9;

// ==================== Mapping Functions ====================

function convertBalanceToDecimal(balance: DTOBalance, decimals: number): number {
    const total = BigInt(balance.amount) + BigInt(balance.promo_amount);
    return Number(toDecimals(total, decimals));
}

function mapDTOBalanceToBalance(
    usdtBalance: DTOBalance,
    tonBalance: DTOBalance | undefined,
    tonRate: number
): Balance {
    const total = convertBalanceToDecimal(usdtBalance, USDT_DECIMALS) +
        (tonBalance ? convertBalanceToDecimal(tonBalance, TON_DECIMALS) * tonRate : 0);

    return {
        total,
        usdt: {
            amount: BigInt(usdtBalance.amount),
            promo_amount: BigInt(usdtBalance.promo_amount)
        },
        ...(tonBalance && {
            ton: {
                amount: BigInt(tonBalance.amount),
                promo_amount: BigInt(tonBalance.promo_amount)
            }
        })
    };
}

// ==================== API Functions ====================

async function fetchTonRate(): Promise<number | undefined> {
    try {
        const data = await tonapiMainnet.rates.getRates({
            tokens: ['ton'],
            currencies: ['usd']
        });
        return data.rates.TON.prices?.USD;
    } catch {
        return undefined;
    }
}

// ==================== React Query Hooks ====================

/**
 * Global hook for fetching project balance
 * Automatically refetches every 3 seconds in background
 * Uses structuralSharing to avoid re-renders if balance hasn't changed
 */
export function useBalanceQuery() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: [...BALANCE_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            // Fetch balance data
            const { data, error } = await getProjectBillingHistory({
                path: { id: projectId },
                query: { limit: 0 }
            });

            if (error) throw error;

            // Fetch TON rate for calculations
            const tonRate = await fetchTonRate();
            if (!tonRate) throw new Error('Failed to fetch TON rate');

            const { usdt_balance, ton_balance } = data;

            return mapDTOBalanceToBalance(usdt_balance, ton_balance, tonRate);
        },
        enabled: !!projectId,
        refetchInterval: 3000, // Refetch every 3 seconds
        refetchIntervalInBackground: true, // Keep refetching even when page is hidden
        staleTime: 0 // Always consider data stale for fresh refetches
    });
}

/**
 * Global hook for fetching TON/USD exchange rate
 * Cached for 5 minutes
 */
export function useTonRateQuery() {
    return useQuery({
        queryKey: TON_RATE_QUERY_KEY,
        queryFn: async () => {
            const rate = await fetchTonRate();
            if (!rate) throw new Error('Failed to fetch TON rate');
            return rate;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 3
    });
}
