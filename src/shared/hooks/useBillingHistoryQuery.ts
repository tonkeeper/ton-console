import { useQuery } from '@tanstack/react-query';
import { DTOBillingTransaction, DTOBillingTxInfo, DTOCryptoCurrency, getProjectBillingHistory } from 'src/shared/api';
import { projectsStore } from 'src/shared/stores';
import { CRYPTO_CURRENCY, TokenCurrencyAmount, TonCurrencyAmount } from '..';

const BILLING_HISTORY_QUERY_KEY = 'billing-history';
const PAGE_SIZE = 20;

export type BillingHistoryItem = {
    id: string;
    date: Date;
    amount: TonCurrencyAmount | TokenCurrencyAmount;
    description: string;
    type: 'deposit' | 'charge';
    info: DTOBillingTxInfo;
};

/**
 * Hook for fetching raw billing history (transaction list)
 * Used to detect new deposits in real-time
 * Returns raw DTOBillingTransaction without complex transformations
 * Auto-refetches every 3 seconds with background updates
 */
export function useBillingHistoryQuery() {
    const projectId = projectsStore.selectedProject?.id;

    return useQuery({
        queryKey: [BILLING_HISTORY_QUERY_KEY, projectId] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectBillingHistory({
                path: { id: projectId },
                query: { limit: PAGE_SIZE } // Fetch last 20 transactions
            });

            if (error) throw error;

            return data.history.map(mapDTOTransactionToBillingHistoryItem);
        },
        enabled: !!projectId,
        staleTime: 30 * 1000 // Consider data fresh for 30 seconds
    });
}

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
