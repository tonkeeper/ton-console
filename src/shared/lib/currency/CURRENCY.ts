import { CRYPTO_CURRENCY } from './CRYPTO_CURRENCY';
import { FIAT_CURRENCY } from './FIAT_CURRENCY';

export const CURRENCY = { ...CRYPTO_CURRENCY, ...FIAT_CURRENCY };
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CURRENCY = CRYPTO_CURRENCY | FIAT_CURRENCY;
