import { TonApiClient } from '@ton-api/client';

const authToken = import.meta.env.VITE_TONAPI_TOKEN;

const isTestnet = true;

export const tonapiClient = new TonApiClient({
    baseUrl: isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
    apiKey: authToken
});

export const tonapiMainnet = new TonApiClient({
    baseUrl: isTestnet ? 'https://testnet.tonapi.io' : 'https://tonapi.io',
    apiKey: authToken
});

export const tonapiTestnet = new TonApiClient({
    baseUrl: 'https://testnet.tonapi.io',
    apiKey: authToken
});
