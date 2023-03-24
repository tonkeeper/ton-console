import { Api } from './api.generated';

export * from './api.generated';

export const apiClient = new Api({ baseURL: import.meta.env.VITE_BASE_URL });
