import { CurrencyAmount } from './currency-amount';
import BigNumber from 'bignumber.js';
import { CURRENCY } from './CURRENCY';
import { fromWei } from 'src/shared/lib/blockchain/wei';
import { BasicCurrencyAmount } from './basic-currency-amount';

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
        decimalPlaces?: number;
        thousandSeparators?: boolean;
    }): string {
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

        return fromWei(this.weiAmount, this.decimals).decimalPlaces(decimalPlaces).toFormat(format);
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
