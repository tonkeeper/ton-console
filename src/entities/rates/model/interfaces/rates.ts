import { CRYPTO_CURRENCY, Loadable } from 'src/shared';
import BigNumber from 'bignumber.js';

export type Rates = {
    [key in keyof typeof CRYPTO_CURRENCY]: BigNumber;
};

export type Rates$ = {
    [key in keyof typeof CRYPTO_CURRENCY]: Loadable<BigNumber>;
};
