import { ApiKey } from './api-key';

export type EditApiKeyForm = Pick<ApiKey, 'id' | 'name'>;
