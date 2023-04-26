import { Amount } from '../types';
import { BasicCurrencyAmount } from './basic-currency-amount';
import { CURRENCY } from './CURRENCY';

export class UsdCurrencyAmount extends BasicCurrencyAmount {
    get stringCurrencyAmount(): string {
        return `$${this.stringAmount}`;
    }

    constructor(amount: Amount) {
        super({ amount, currency: CURRENCY.USD });
    }
}
