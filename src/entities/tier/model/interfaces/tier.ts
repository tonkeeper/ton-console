export interface Tier {
    id: number;
    name: string;
    description: {
        connections: {
            accountsLimit: number;
            subscriptionsLimit: number;
        };
        requestsPerSecondLimit: number;
    };
    tonPrice: number;
}
