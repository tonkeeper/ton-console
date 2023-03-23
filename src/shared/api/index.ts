import { Api } from './api.generated';

export * from './api.generated';

export const api = new Api({ baseURL: import.meta.env.VITE_BASE_URL });
