import { CurrencyAmount } from 'src/shared';
import { SERVICE } from '../../../service';

export interface Subscription<T = SubscriptionDetails> {
    service: SERVICE;
    price: CurrencyAmount;
    interval: 'Monthly';
    renewsDate: Date;

    details: T;
}

export type SubscriptionDetails = Record<string, unknown>;
