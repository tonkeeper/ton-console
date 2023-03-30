import { CurrencyAmount } from 'src/shared';

export interface Refill {
    id: number;
    date: Date;
    fromAddress: string;
    amount: CurrencyAmount;
    action: 'refill';
}
