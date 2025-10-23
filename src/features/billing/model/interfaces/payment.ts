import { CurrencyAmount, UsdCurrencyAmount } from 'src/shared';

export interface Payment {
    id: number;
    name: string;
    date: Date;
    amount: CurrencyAmount;
    amountUsdEquivalent?: UsdCurrencyAmount;
}
