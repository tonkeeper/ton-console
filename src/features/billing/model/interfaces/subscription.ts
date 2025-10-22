import { UsdCurrencyAmount } from 'src/shared';

export interface Subscription {
    id: string;
    plan: string;
    interval: string;
    renewsDate: Date;
    price: UsdCurrencyAmount;
}
