import { UsdCurrencyAmount } from 'src/shared';

// monthly, pay as you go
export interface RestApiTier {
    id: number;
    name: string;
    rps: number;
    type: 'monthly' | 'pay-as-you-go';
    price: UsdCurrencyAmount;
    unspentMoney?: UsdCurrencyAmount;
}

export interface RestApiSelectedTier extends RestApiTier {
    active: true;
    renewsDate?: Date;
}

export function isRestApiSelectedTier(value: RestApiTier): value is RestApiSelectedTier {
    return 'active' in value && !!value.active;
}
