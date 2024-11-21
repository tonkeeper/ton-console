export interface Webhook {
    id: number;
    endpoint: string;
    subscribed_accounts: number;
    token: string;
}

export type WebhooksStatType = 'delivered' | 'failed';

export interface WebhooksStat {
    result: {
        metric: { type: WebhooksStatType };
        values: [number, string][];
    }[];
}
