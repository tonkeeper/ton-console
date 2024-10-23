import { Webhook } from './webhooks';
import { CreateWebhookForm } from './create-webhooks-form';

export type EditWebhookForm = Pick<Webhook, 'id'> & CreateWebhookForm;
