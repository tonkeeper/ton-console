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
        return fromWei(this.amount, this.decimals).decimalPlaces(decimalPlaces).toString();
    }

    toStringCurrencyAmount(precision: number): string {
        return `${this.toStringAmount(precision)} ${this.stringCurrency}`;
    }

    toJSON(): TokenCurrencyAmountStruct & { $type: 'TokenCurrencyAmount' } {
        return {
            $type: 'TokenCurrencyAmount',
            currency: this.currency,
            weiAmount: this.amount.toString(),
            decimals: this.decimals
        };
    }

    constructor({ weiAmount, currency, decimals }: TokenCurrencyAmountStruct) {
        this.amount = new BigNumber(weiAmount);
        this.currency = currency;
        this.decimals = decimals;
    }
}
