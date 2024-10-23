import { Webhook } from './webhooks';

export type CreateWebhookForm = Pick<Webhook, 'endpoint'>;
