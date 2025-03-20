import { CRYPTO_CURRENCY, tonapiMainnet } from 'src/shared';
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
    const token = backendCurrenciesMapping[currency];

    const data = await tonapiMainnet.rates.getRates({
        tokens: [token.request],
        currencies: ['usd']
    });

    const tokenRate = data.rates[token.response].prices?.USD;
    return tokenRate ? new BigNumber(tokenRate) : new BigNumber(0);
}
