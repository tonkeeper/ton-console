import { CurrencyAmount } from './currency-amount';
import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';
import { Amount } from '../types';

type BasicCurrencyAmountStruct = { amount: Amount; currency: CURRENCY };

export class BasicCurrencyAmount implements CurrencyAmount {
    public readonly amount: BigNumber;

    public readonly currency: CURRENCY;

    get stringCurrency(): string {
        return this.currency;
    }

    get stringAmount(): string {
        return this.toStringAmount();
    }

    get stringCurrencyAmount(): string {
        return `${this.stringAmount} ${this.stringCurrency}`;
    }

    protected readonly decimalPlaces = 3;

    constructor({ amount, currency }: BasicCurrencyAmountStruct) {
        this.amount = new BigNumber(amount);
        this.currency = currency;
    }

    public isEQ(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.amount.eq(currencyAmount.amount);
    }

    isGT(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.amount.gt(currencyAmount.amount);
    }

    isGTE(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.amount.gte(currencyAmount.amount);
    }

    isLT(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.amount.lt(currencyAmount.amount);
    }

    isLTE(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.amount.lte(currencyAmount.amount);
    }

    toStringAmount(decimalPlaces?: number): string {
        if (decimalPlaces === undefined) {
            decimalPlaces = this.decimalPlaces;
        }
        return this.amount.decimalPlaces(decimalPlaces).toString();
    }

    toStringCurrencyAmount(decimalPlaces?: number): string {
        return `${this.toStringAmount(decimalPlaces)} ${this.stringCurrency}`;
    }

    toJSON(): unknown {
        return {
            $type: 'BasicCurrencyAmount',
            currency: this.currency,
            amount: this.amount.toString()
        };
    }

    protected checkIfCanCompareCurrencies(currencyAmount: CurrencyAmount): never | void {
        if (currencyAmount.currency !== this.currency) {
            throw new Error(
                `Can't compare ${this.currency} and ${currencyAmount.currency} amounts because they have different currencies types.`
            );
        }
    }
}
