import { CRYPTO_CURRENCY } from 'src/shared';
import BigNumber from 'bignumber.js';

const backendCurrenciesMapping = {
    [CRYPTO_CURRENCY.TON]: {
        request: 'ton',
        response: 'TON'
    },
    [CRYPTO_CURRENCY.USDT]: {
        request: 'usdt',
        response: 'USDT'
    }
};

export async function fetchRate(currency: CRYPTO_CURRENCY): Promise<BigNumber> {
    const response = await fetch(
        `${import.meta.env.VITE_TONAPI_BASE_URL}rates?tokens=${
            backendCurrenciesMapping[currency].request
        }&currencies=usd`
    );

    const data = await response.json();

    return new BigNumber(data.rates[backendCurrenciesMapping[currency].response].prices.USD);
}
