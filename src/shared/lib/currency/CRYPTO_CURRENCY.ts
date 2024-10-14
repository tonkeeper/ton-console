export enum CRYPTO_CURRENCY {
    TON = 'TON',
    USDT = 'USDT'
}

export const CRYPTO_CURRENCY_DECIMALS: Record<CRYPTO_CURRENCY, number> = {
    [CRYPTO_CURRENCY.TON]: 9,
    [CRYPTO_CURRENCY.USDT]: 6
} as const;
