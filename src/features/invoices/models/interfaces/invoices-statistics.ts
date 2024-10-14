import { CRYPTO_CURRENCY, CurrencyAmount } from 'src/shared';

export interface InvoicesAllStatistics {
    [CRYPTO_CURRENCY.TON]: InvoicesStatistics;
    [CRYPTO_CURRENCY.USDT]: InvoicesStatistics;
}

export interface InvoicesStatistics {
    totalInvoices: number;
    earnedTotal: CurrencyAmount;
    earnedLastWeek: CurrencyAmount;
    invoicesInProgress: number;
    awaitingForPaymentAmount: CurrencyAmount;
}
