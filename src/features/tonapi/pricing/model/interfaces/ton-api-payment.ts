import { TonApiTier } from './ton-api-tier';
import { TonCurrencyAmount, UsdCurrencyAmount } from 'src/shared';

export interface TonApiPayment {
    id: string;
    tier: TonApiTier;
    amount: TonCurrencyAmount;
    amountUsdEquivalent: UsdCurrencyAmount;

    date: Date;
}
