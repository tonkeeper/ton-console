import { CurrencyAmount } from 'src/shared';

export interface InvoicesStatistics {
    totalInvoices: number;
    earnedTotal: CurrencyAmount;
    earnedLastWeek: CurrencyAmount;
    invoicesInProgress: number;
    awaitingForPaymentAmount: CurrencyAmount;
}
