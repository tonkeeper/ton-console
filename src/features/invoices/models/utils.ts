import { CRYPTO_CURRENCY, DTOCryptoCurrency, TokenCurrencyAmount } from 'src/shared';
import { CRYPTO_CURRENCY_DECIMALS } from 'src/shared/lib/currency/CRYPTO_CURRENCY';

export const convertDTOCryptoCurrencyToCryptoCurrency = (
    currency: DTOCryptoCurrency
): CRYPTO_CURRENCY => {
    switch (currency) {
        case DTOCryptoCurrency.DTO_TON:
            return CRYPTO_CURRENCY.TON;
        case DTOCryptoCurrency.DTO_USDT:
            return CRYPTO_CURRENCY.USDT;
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
};

export const convertCryptoCurrencyToDTOCryptoCurrency = (
    currency: CRYPTO_CURRENCY
): DTOCryptoCurrency => {
    switch (currency) {
        case CRYPTO_CURRENCY.TON:
            return DTOCryptoCurrency.DTO_TON;
        case CRYPTO_CURRENCY.USDT:
            return DTOCryptoCurrency.DTO_USDT;
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
};

export const getTokenCurrencyAmountFromDTO = (
    amount: string | number,
    currency: DTOCryptoCurrency
): TokenCurrencyAmount => {
    return new TokenCurrencyAmount({
        weiAmount: amount.toString(),
        currency: convertDTOCryptoCurrencyToCryptoCurrency(currency),
        decimals: CRYPTO_CURRENCY_DECIMALS[currency]
    });
};
