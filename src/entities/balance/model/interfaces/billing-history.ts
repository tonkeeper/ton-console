import { Payment } from './payment';
import { Refill } from './refill';
import { IPaymentDescription } from './i-payment-description';

export type BillingHistory<T extends IPaymentDescription = IPaymentDescription> = (
    | Payment<T>
    | Refill
)[];
