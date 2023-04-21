import { CURRENCY, Loadable } from 'src/shared';
import BigNumber from 'bignumber.js';

export type Rates = {
    [key in keyof typeof CURRENCY]: BigNumber;
};

export type Rates$ = {
    [key in keyof typeof CURRENCY]: Loadable<BigNumber>;
};
