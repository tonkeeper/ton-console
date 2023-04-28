import { UsdCurrencyAmount } from 'src/shared';

export interface TonApiTier {
    id: number;
    name: string;
    description: {
        requestsPerSecondLimit: number;
    };
    price: UsdCurrencyAmount;
}
