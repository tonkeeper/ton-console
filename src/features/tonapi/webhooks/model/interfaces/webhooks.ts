import { RTWebhookList } from 'src/shared/api/streaming-api';

export type Webhook = RTWebhookList['webhooks'][number];

export type WebhooksStatType = 'delivered' | 'failed';

export interface WebhooksStat {
    result: {
        metric: { type: WebhooksStatType };
        values: [number, string][];
    }[];
}
