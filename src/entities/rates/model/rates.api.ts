import { CURRENCY } from 'src/shared';
import BigNumber from 'bignumber.js';

const backendCurrenciesMapping = {
    [CURRENCY.TON]: {
        request: 'ton',
        response: 'TON'
    }
};

export async function fetchRate(currency: CURRENCY): Promise<BigNumber> {
    const response = await fetch(
        `${import.meta.env.VITE_TONAPI_BASE_URL}rates?tokens=${
            backendCurrenciesMapping[currency].request
        }&currencies=usd`
    );

    const data = await response.json();

    return new BigNumber(data.rates[backendCurrenciesMapping[currency].response].prices.USD);
}
