import { CurrencyAmount } from './currency-amount';
import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';
import { Amount } from '../types';

type BasicCurrencyAmountStruct = { amount: Amount; currency: CURRENCY };

export class BasicCurrencyAmount implements CurrencyAmount {
    public readonly amount: BigNumber;

    public readonly currency: CURRENCY;

    protected readonly decimalPlaces = 2;

    protected readonly thousandSeparators = true;

    get stringCurrency(): string {
        return this.currency;
    }

    get stringAmount(): string {
        return this.toStringAmount();
    }

    get stringCurrencyAmount(): string {
        return `${this.stringAmount} ${this.stringCurrency}`;
    }

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

    toStringAmount(options?: { decimalPlaces?: number; thousandSeparators?: boolean }): string {
        const decimalPlaces =
            options?.decimalPlaces === undefined ? this.decimalPlaces : options.decimalPlaces;

        const thousandSeparators =
            options?.thousandSeparators === undefined
                ? this.thousandSeparators
                : options.thousandSeparators;

        const format = {
            decimalSeparator: '.',
            groupSeparator: thousandSeparators ? ' ' : '',
            groupSize: 3
        };

        return this.amount.decimalPlaces(decimalPlaces).toFormat(format);
    }

    toStringCurrencyAmount(options?: {
        decimalPlaces?: number;
        thousandSeparators?: boolean;
    }): string {
        return `${this.toStringAmount(options)} ${this.stringCurrency}`;
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
