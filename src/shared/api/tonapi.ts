import { TonApiClient, Api } from '@ton-api/client';

const authToken = import.meta.env.VITE_TONAPI_TOKEN;

export const ta = new Api(
    new TonApiClient({
        baseUrl: 'https://tonapi.io',
        apiKey: authToken
    })
);

export const taTestnet = new Api(
    new TonApiClient({
        baseUrl: 'https://testnet.tonapi.io',
        apiKey: authToken
    })
);
