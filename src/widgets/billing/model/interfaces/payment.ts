import { CurrencyAmount, UsdCurrencyAmount } from 'src/shared';

export interface Payment {
    id: string;
    name: string;
    date: Date;
    amount: CurrencyAmount;
    amountUsdEquivalent?: UsdCurrencyAmount;
}
