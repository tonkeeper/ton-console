import { ApiKey } from './api-key';
import { CreateApiKeyForm } from './create-api-key-form';

export type EditApiKeyForm = Pick<ApiKey, 'id'> & CreateApiKeyForm;
