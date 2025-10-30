import { useQuery } from '@tanstack/react-query';
import { DTOBillingTransaction, DTOBillingTxInfo, DTOCryptoCurrency, getProjectBillingHistory } from 'src/shared/api';
import { CRYPTO_CURRENCY, TokenCurrencyAmount, TonCurrencyAmount } from '..';
import { useProjectId } from '../contexts/ProjectContext';

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

interface UseBillingHistoryQueryOptions {
    before_tx?: string;
    limit?: number;
}

/**
 * Hook for fetching billing history (transaction list)
 * Supports cursor-based pagination with before_tx cursor
 */
export function useBillingHistoryQuery(options: UseBillingHistoryQueryOptions = {}) {
    const { before_tx, limit = PAGE_SIZE } = options;
    const projectId = useProjectId();

    return useQuery({
        queryKey: [BILLING_HISTORY_QUERY_KEY, projectId, before_tx, limit] as const,
        queryFn: async () => {
            if (!projectId) throw new Error('No project selected');

            const { data, error } = await getProjectBillingHistory({
                path: { id: projectId },
                query: { before_tx, limit }
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
