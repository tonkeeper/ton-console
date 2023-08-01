import { TonCurrencyAmount, UsdCurrencyAmount } from 'src/shared';

export interface FaucetPayment {
    id: string;
    boughtAmount: TonCurrencyAmount;
    amount: TonCurrencyAmount;
    amountUsdEquivalent: UsdCurrencyAmount;
    date: Date;
}
