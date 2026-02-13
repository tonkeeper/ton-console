import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import {
    getProjectBillingHistory,
    DTOBalance
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { tonapiMainnet, toDecimals } from 'src/shared';
import { Balance, SufficiencyCheckResult } from './interfaces';

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

// ==================== Sufficiency Check Function ====================

/**
 * Calculate balance sufficiency for a given USD amount
 * @param balance Current balance (USDT + optionally TON)
 * @param amountInUsd Amount to check (in USD, can be decimal like 0.2 or 10.5)
 * @param tonRate Current TON/USD exchange rate
 * @param includePromo Whether to include promo amount in the check
 * @param onlyUsdt If true, only check USDT balance (ignore TON)
 * @returns SufficiencyCheckResult with detailed breakdown
 */
export function calculateBalanceSufficiency(
    balance: Balance,
    amountInUsd: BigNumber,
    tonRate: number,
    includePromo = true,
    onlyUsdt = false
): SufficiencyCheckResult {
    // Convert USD amount to cents (since USDT is in 6 decimals, but we work in cents for simplicity)
    const amountInMicroUsdt = amountInUsd.multipliedBy(1e6);

    // Check USDT sufficiency
    const usdtBalance = includePromo
        ? balance.usdt.amount + balance.usdt.promo_amount
        : balance.usdt.amount;

    const usdtSufficient = usdtBalance >= BigInt(amountInMicroUsdt.toFixed(0));
    const usdtDeficit = usdtSufficient ? BigInt(0) : BigInt(amountInMicroUsdt.toFixed(0)) - usdtBalance;

    // Check TON sufficiency (if TON balance exists)
    let tonSufficient = false;
    let tonDeficit = BigInt(0);

    if (balance.ton) {
        const tonBalance = includePromo
            ? balance.ton.amount + balance.ton.promo_amount
            : balance.ton.amount;

        // Convert TON to USD equivalent
        // tonBalance is in nanoTON (10^9), so convert to TON first
        const tonInUsd = Number(tonBalance) / Math.pow(10, TON_DECIMALS) * tonRate;
        const tonInUsdMicroUsd = new BigNumber(tonInUsd).multipliedBy(1e6);

        tonSufficient = tonInUsdMicroUsd.gte(amountInMicroUsdt);
        tonDeficit = tonSufficient ? BigInt(0) : BigInt(amountInMicroUsdt.minus(tonInUsdMicroUsd).toFixed(0));
    }

    return {
        canPay: onlyUsdt ? usdtSufficient : (usdtSufficient || tonSufficient),
        usdt: {
            sufficient: usdtSufficient,
            deficit: usdtDeficit
        },
        ...(balance.ton && {
            ton: {
                sufficient: tonSufficient,
                deficit: tonDeficit
            }
        })
    };
}

/**
 * Get the minimum deficit needed to make payment possible
 * @param check SufficiencyCheckResult from calculateBalanceSufficiency
 * @returns The minimum deficit (in the currency that needs less funding)
 */
export function getPaymentDeficit(check: SufficiencyCheckResult): bigint {
    if (check.canPay) {
        return BigInt(0);
    }

    // If only USDT is insufficient
    if (!check.usdt.sufficient && (!check.ton || check.ton.sufficient)) {
        return check.usdt.deficit;
    }

    // If only TON is insufficient
    if (check.ton && !check.ton.sufficient && check.usdt.sufficient) {
        return check.ton.deficit;
    }

    // Both are insufficient - return the minimum deficit
    if (check.ton && !check.ton.sufficient && !check.usdt.sufficient) {
        return check.ton.deficit < check.usdt.deficit ? check.ton.deficit : check.usdt.deficit;
    }

    // Fallback (shouldn't reach here)
    return check.usdt.deficit;
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
        retry: 1
    });
}

/**
 * Hook to check if balance is sufficient for a given USD amount
 * @param amountInUsd Amount in USD (can be decimal like 0.2)
 * @param options Options for the check
 * @returns SufficiencyCheckResult or undefined if loading/error
 */
export function useBalanceSufficiencyCheck(
    amountInUsd: BigNumber | null,
    options?: { includePromo?: boolean; onlyUsdt?: boolean }
): SufficiencyCheckResult | undefined {
    const { data: balance } = useBalanceQuery();
    const { data: tonRate } = useTonRateQuery();

    // Return undefined while loading or if dependencies are missing
    if (!balance || !tonRate || !amountInUsd) {
        return undefined;
    }

    return calculateBalanceSufficiency(
        balance,
        amountInUsd,
        tonRate,
        options?.includePromo ?? true,
        options?.onlyUsdt ?? false
    );
}
