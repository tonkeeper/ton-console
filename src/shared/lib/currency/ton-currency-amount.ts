import { TokenCurrencyAmount } from './token-currency-amount';
import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';
import { toWei } from 'src/shared';

export class TonCurrencyAmount extends TokenCurrencyAmount {
    static fromRelativeAmount(amount: number | string | BigNumber): TonCurrencyAmount {
        return new TonCurrencyAmount(toWei(amount, 9));
    }

    constructor(nanoAmount: number | string | BigNumber) {
        super({
            currency: CURRENCY.TON,
            decimals: 9,
            weiAmount: new BigNumber(nanoAmount).toString()
        });
    }
}
