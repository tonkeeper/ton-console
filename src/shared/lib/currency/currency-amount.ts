import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';

export interface CurrencyAmount {
    readonly currency: CURRENCY;

    readonly amount: BigNumber;

    stringCurrency: string;

    stringAmount: string;

    stringCurrencyAmount: string;

    toStringAmount(options?: { decimalPlaces?: number; thousandSeparators?: boolean }): string;

    toStringCurrencyAmount(options?: {
        decimalPlaces?: number;
        thousandSeparators?: boolean;
    }): string;

    toJSON(): unknown;

    isGTE(currencyAmount: CurrencyAmount): boolean;

    isGT(currencyAmount: CurrencyAmount): boolean;

    isEQ(currencyAmount: CurrencyAmount): boolean;

    isLTE(currencyAmount: CurrencyAmount): boolean;

    isLT(currencyAmount: CurrencyAmount): boolean;
}
