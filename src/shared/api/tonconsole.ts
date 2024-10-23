import { Api } from './api.generated';

export const apiClientBaseURL = import.meta.env.VITE_BASE_URL;

export const backendBaseURL =
    apiClientBaseURL === '/' ? import.meta.env.VITE_BASE_PROXY_URL : apiClientBaseURL;

export const apiClient = new Api({
    baseURL: apiClientBaseURL,
    paramsSerializer: {
        indexes: null
    }
});
