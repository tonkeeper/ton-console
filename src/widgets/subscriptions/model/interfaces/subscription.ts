import { CurrencyAmount } from 'src/shared';

export interface Subscription {
    id: string;
    plan: string;
    interval: 'Monthly';
    renewsDate: Date;
    price: CurrencyAmount;

    // onCancel(): void;
}
