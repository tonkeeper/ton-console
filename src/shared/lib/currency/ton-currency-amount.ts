import { TokenCurrencyAmount } from './token-currency-amount';
import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';
import { toWei } from '../blockchain';
import { CRYPTO_CURRENCY_DECIMALS } from './CRYPTO_CURRENCY';

export class TonCurrencyAmount extends TokenCurrencyAmount {
    static fromRelativeAmount(amount: number | string | BigNumber): TonCurrencyAmount {
        return new TonCurrencyAmount(toWei(amount, CRYPTO_CURRENCY_DECIMALS[CURRENCY.TON]));
    }

    constructor(nanoAmount: number | string | BigNumber) {
        super({
            currency: CURRENCY.TON,
            decimals: CRYPTO_CURRENCY_DECIMALS[CURRENCY.TON],
            weiAmount: new BigNumber(nanoAmount).toString()
        });
    }
}
