import { TonApiTier } from './ton-api-tier';
import { CurrencyAmount } from 'src/shared';

export interface TonApiPayment {
    id: string;
    tier: TonApiTier;

    amount: CurrencyAmount;

    date: Date;
}
