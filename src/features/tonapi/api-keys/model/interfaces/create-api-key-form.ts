import { ApiKey } from './api-key';

export type CreateApiKeyForm = Pick<ApiKey, 'name' | 'limitRps' | 'origins'>;
