export interface TonApiStats {
    chart: {
        time: number;
        requests?: number;
        liteproxyRequests?: number;
        liteproxyConnections?: number;
        webhooksDelivered?: number;
        webhooksFailed?: number;
    }[];
}
