import { Payment } from './payment';
import { Refill } from 'src/entities';

export type BillingHistoryPaymentItem = Payment & { action: 'payment' };
export type BillingHistoryRefillItem = Refill & { action: 'refill' };
export type BillingHistoryItem = BillingHistoryPaymentItem | BillingHistoryRefillItem;
export type BillingHistory = BillingHistoryItem[];
