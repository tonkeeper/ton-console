import { CurrencyAmount } from './currency-amount';
import BigNumber from 'bignumber.js';
import { CURRENCY } from './CURRENCY';
import { fromWei } from 'src/shared/lib/blockchain/wei';

export type TokenCurrencyAmountStruct = {
    weiAmount: string;
    currency: CURRENCY;
    decimals: number;
};

export class TokenCurrencyAmount implements CurrencyAmount {
    private readonly decimals: number;

    private readonly decimalPlaces = 3;

    public readonly weiAmount: BigNumber;

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

    toStringAmount(decimalPlaces?: number): string {
        if (decimalPlaces === undefined) {
            decimalPlaces = this.decimalPlaces;
        }
        return fromWei(this.weiAmount, this.decimals).decimalPlaces(decimalPlaces).toString();
    }

    toStringCurrencyAmount(precision: number): string {
        return `${this.toStringAmount(precision)} ${this.stringCurrency}`;
    }

    toJSON(): TokenCurrencyAmountStruct & { $type: 'TokenCurrencyAmount' } {
        return {
            $type: 'TokenCurrencyAmount',
            currency: this.currency,
            weiAmount: this.weiAmount.toString(),
            decimals: this.decimals
        };
    }

    constructor({ weiAmount, currency, decimals }: TokenCurrencyAmountStruct) {
        this.weiAmount = new BigNumber(weiAmount);
        this.currency = currency;
        this.decimals = decimals;
        this.amount = new BigNumber(fromWei(this.weiAmount, this.decimals));
    }

    public isEQ(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.weiAmount.eq(currencyAmount.weiAmount);
    }

    isGT(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.weiAmount.gt(currencyAmount.weiAmount);
    }

    isGTE(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.weiAmount.gte(currencyAmount.weiAmount);
    }

    isLT(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.weiAmount.lt(currencyAmount.weiAmount);
    }

    isLTE(currencyAmount: CurrencyAmount): boolean {
        this.checkIfCanCompareCurrencies(currencyAmount);
        return this.weiAmount.lte(currencyAmount.weiAmount);
    }

    private checkIfCanCompareCurrencies(currencyAmount: CurrencyAmount): never | void {
        if (currencyAmount.currency !== this.currency) {
            throw new Error(
                `Can't compare ${this.currency} and ${currencyAmount.currency} amounts because they have different currencies types.`
            );
        }
    }
}
