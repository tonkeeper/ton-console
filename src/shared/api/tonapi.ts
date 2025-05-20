import { TonApiClient } from '@ton-api/client';

const authToken = import.meta.env.VITE_TONAPI_TOKEN;

export const tonapiMainnet = new TonApiClient({
    baseUrl: 'https://tonapi.io',
    apiKey: authToken
});

export const tonapiTestnet = new TonApiClient({
    baseUrl: 'https://testnet.tonapi.io',
    apiKey: authToken
});

const isTestnet = import.meta.env.VITE_TESTNET === 'true';
export const tonapiClient = isTestnet ? tonapiTestnet : tonapiMainnet;
