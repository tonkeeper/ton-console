import { CurrencyAmount } from 'src/shared';

export interface TonApiTier {
    id: number;
    name: string;
    description: {
        connections: {
            accountsLimit: number;
            subscriptionsLimit: number;
        };
        requestsPerSecondLimit: number;
    };
    price: CurrencyAmount;
}
