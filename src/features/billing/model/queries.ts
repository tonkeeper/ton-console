import { useQuery } from '@tanstack/react-query';
import {
    getProjectBillingHistory,
    DTOBillingTransaction,
    DTOCryptoCurrency,
    DTOProjectLiteproxyTierDetail,
    DTOBillingTxInfo
} from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import {
    TokenCurrencyAmount,
    TonCurrencyAmount,
    CRYPTO_CURRENCY,
    UsdCurrencyAmount
} from 'src/shared';
import { useLiteproxySelectedTierQuery } from 'src/features/tonapi/liteproxy/model/queries';
import { useRestApiSelectedTierQuery } from 'src/features/tonapi/pricing/model/queries';
import { RestApiSelectedTier } from 'src/features/tonapi/pricing/model/interfaces';
import { Subscription } from './interfaces/subscription';

export type BillingHistoryItem = {
    id: string;
    date: Date;
    amount: TonCurrencyAmount | TokenCurrencyAmount;
    description: string;
    type: 'deposit' | 'charge';
    info: DTOBillingTxInfo;
};

const BILLING_HISTORY_QUERY_KEY = ['billing-history'] as const;
const PAGE_SIZE = 20;

// ==================== Mapping Functions ====================

function mapDTOTransactionToBillingHistoryItem(dtoTx: DTOBillingTransaction): BillingHistoryItem {
    const date = new Date(dtoTx.created_at * 1000);
    const amount = mapDTOCurrencyToAmount(dtoTx.currency, dtoTx.amount);

    return {
        id: dtoTx.id,
        date,
        amount,
        description: dtoTx.description,
        type: dtoTx.type,
        info: dtoTx.info
    };
}

function mapDTOCurrencyToAmount(currency: DTOCryptoCurrency, amount: string) {
    switch (currency) {
        case DTOCryptoCurrency.TON:
            return new TonCurrencyAmount(amount);
        case DTOCryptoCurrency.USDT:
            return new TokenCurrencyAmount({
                weiAmount: amount,
                currency: CRYPTO_CURRENCY.USDT,
                decimals: 6
            });
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
}

// ==================== React Query Hooks ====================

/**
 * LOCAL hook for fetching billing history
 * Used only in BillingBlock/BalancePage
 * Automatically refetches when projectId changes
 */
export function useBillingHistoryQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery({
        queryKey: [...BILLING_HISTORY_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectBillingHistory({
                path: { id: projectId },
                query: { limit: PAGE_SIZE }
            });

            if (error) throw error;

            return (data.history || []).map(mapDTOTransactionToBillingHistoryItem);
        },
        enabled: !!projectId,
        staleTime: 30 * 1000 // Consider data fresh for 30 seconds
    });
}

/**
 * Hook for fetching current subscriptions (REST API + Liteproxy tiers)
 * Combines data from both REST API and Liteproxy services
 * If a tier request fails, that subscription will be null and won't be displayed
 */
export function useSubscriptionsQuery() {
    const { data: restApiTier, isLoading: isRestApiLoading, error: restApiError } = useRestApiSelectedTierQuery();
    const { data: liteproxyTier, isLoading: isLiteproxyLoading, error: liteproxyError } = useLiteproxySelectedTierQuery();

    const isLoading = isRestApiLoading || isLiteproxyLoading;

    // If request failed, pass null to mapping function, which returns null
    const subscriptions = {
        restApi: restApiError ? null : mapRestApiTierToSubscription(restApiTier ?? null),
        liteproxy: liteproxyError ? null : mapLiteproxyTierToSubscription(liteproxyTier ?? null)
    };

    return {
        data: subscriptions,
        isLoading
    };
}

function mapRestApiTierToSubscription(tier: RestApiSelectedTier | null): Subscription | null {
    if (!tier) {
        return null;
    }

    return {
        id: `tonapi-${tier.id}`,
        plan: `REST API «${tier.name}»`,
        interval: tier.type === 'monthly' ? 'Monthly' : 'Pay as you go',
        renewsDate: tier.renewsDate,
        price: tier.price
    };
}

function mapLiteproxyTierToSubscription(
    tier: DTOProjectLiteproxyTierDetail | null
): Subscription | null {
    if (!tier) {
        return null;
    }

    const liteproxyNextPayment =
        tier.name !== 'Free' && tier.next_payment ? new Date(tier.next_payment) : undefined;

    return {
        id: `liteproxy-${tier.id}`,
        plan: `Liteservers «${tier.name}»`,
        interval: 'Monthly',
        renewsDate: liteproxyNextPayment,
        price: new UsdCurrencyAmount(tier.usd_price)
    };
}
