import { CurrencyAmount } from 'src/shared';
import { SERVICE } from '../../../service';

export interface Subscription<T extends ISubscriptionDetails = ISubscriptionDetails> {
    id: number;
    price: CurrencyAmount;
    interval: 'Monthly';
    renewsDate: Date;

    details: T;
}

export type ISubscriptionDetails<S extends SERVICE = SERVICE, D = Record<string, unknown>> = {
    service: S;
} & D;
