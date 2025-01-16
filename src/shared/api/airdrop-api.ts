import { Api } from './airdrop.generated';

export * from './airdrop.generated';

export const apiAirdropBaseURL = import.meta.env.VITE_BASE_URL;

export const airdropApiClient = new Api({
    baseURL: apiAirdropBaseURL + 'airdrop-api',
    paramsSerializer: {
        indexes: null
    }
});
