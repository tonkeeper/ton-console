import { TonCurrencyAmount, UsdCurrencyAmount } from 'src/shared';

export interface AnalyticsPayment {
    id: string;
    amount: TonCurrencyAmount;
    amountUsdEquivalent: UsdCurrencyAmount;
    date: Date;
    subservice: 'query' | 'graph';
}
