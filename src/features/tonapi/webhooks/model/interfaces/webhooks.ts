import { RTWebhookListStatusEnum } from 'src/shared/api/streaming-api';

export interface Webhook {
    id: number;
    endpoint: string;
    subscribed_accounts: number;
    token: string;
    status: RTWebhookListStatusEnum;
}

export type WebhooksStatType = 'delivered' | 'failed';

export interface WebhooksStat {
    result: {
        metric: { type: WebhooksStatType };
        values: [number, string][];
    }[];
}
