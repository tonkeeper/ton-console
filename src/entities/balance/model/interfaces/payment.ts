import { CurrencyAmount } from 'src/shared';
import { IPaymentDescription } from './i-payment-description';

export interface Payment<T extends IPaymentDescription> {
    id: number;
    date: Date;
    description: T;
    amount: CurrencyAmount;
    action: 'payment';
}
