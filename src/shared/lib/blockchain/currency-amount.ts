import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';

export interface CurrencyAmount {
    readonly currency: CURRENCY;

    readonly amount: BigNumber;

    stringCurrency: string;

    stringAmount: string;

    stringCurrencyAmount: string;

    toStringAmount(precision: number): string;

    toStringCurrencyAmount(precision: number): string;
}
