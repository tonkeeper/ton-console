import { TonApiClient, Api } from '@ton-api/client';

const authToken = import.meta.env.VITE_TONAPI_TOKEN;
const host = 'https://tonapi.io';

const httpClient = new TonApiClient({
    baseUrl: host,
    apiKey: authToken
});

export const tonApiClient = new Api(httpClient);
