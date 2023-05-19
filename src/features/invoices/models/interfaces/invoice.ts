import { CurrencyAmount } from 'src/shared';

export type InvoiceStatus = 'pending' | 'success' | 'cancelled' | 'expired';

export interface InvoiceCommon {
    id: string;
    amount: CurrencyAmount;
    validUntil: Date;
    subtractFeeFromAmount: boolean;
    description: string;
    status: InvoiceStatus;
    creationDate: Date;
}

export interface InvoiceSuccessful extends InvoiceCommon {
    paidBy: string;
    status: 'success';
}

export type Invoice = InvoiceCommon | InvoiceSuccessful;
