import { CurrencyAmount } from './currency-amount';
import BigNumber from 'bignumber.js';
import { CURRENCY } from './CURRENCY';
import { fromWei } from 'src/shared/lib/blockchain/wei';
import { BasicCurrencyAmount } from './basic-currency-amount';
import { formatNumber } from 'src/shared';

export type TokenCurrencyAmountStruct = {
    weiAmount: string;
    currency: CURRENCY;
    decimals: number;
};

export class TokenCurrencyAmount extends BasicCurrencyAmount implements CurrencyAmount {
    private readonly decimals: number;

    public readonly weiAmount: BigNumber;

    get stringWeiAmount(): string {
        return this.weiAmount.toFixed(0);
    }

    override toStringAmount(options?: {
        decimalPlaces?: number | null;
        thousandSeparators?: boolean;
    }): string {
        const decimalPlaces =
            options?.decimalPlaces === undefined
                ? this.decimalPlaces
                : options.decimalPlaces === null
                ? this.decimals
                : options.decimalPlaces;

        const thousandSeparators =
            options?.thousandSeparators === undefined
                ? this.thousandSeparators
                : options.thousandSeparators;

        return formatNumber(fromWei(this.weiAmount, this.decimals), {
            decimalPlaces,
            thousandSeparators
        });
    }

    override toStringCurrencyAmount(options?: {
        decimalPlaces?: number | null;
        thousandSeparators?: boolean;
    }): string {
        return `${this.toStringAmount(options)}${String.fromCharCode(160)}${this.stringCurrency}`;
    }

    override toJSON(): TokenCurrencyAmountStruct & { $type: 'TokenCurrencyAmount' } {
        return {
            $type: 'TokenCurrencyAmount',
            currency: this.currency,
            weiAmount: this.weiAmount.toString(),
            decimals: this.decimals
        };
    }

    constructor({ weiAmount, currency, decimals }: TokenCurrencyAmountStruct) {
        super({ amount: new BigNumber(fromWei(weiAmount, decimals)), currency });
        this.weiAmount = new BigNumber(weiAmount);
        this.decimals = decimals;
    }
}
