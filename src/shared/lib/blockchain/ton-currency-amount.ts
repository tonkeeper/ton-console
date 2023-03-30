import { TokenCurrencyAmount } from './token-currency-amount';
import { CURRENCY } from './CURRENCY';
import BigNumber from 'bignumber.js';

export class TonCurrencyAmount extends TokenCurrencyAmount {
    constructor(nanoAmount: number | string | BigNumber) {
        super({
            currency: CURRENCY.TON,
            decimals: 9,
            weiAmount: nanoAmount
        });
    }
}
