import { CurrencyAmount } from 'src/shared';

export type InvoiceStatus = 'pending' | 'success' | 'cancelled' | 'expired';

export interface InvoiceCommon {
    id: string;
    amount: CurrencyAmount;
    validUntil: Date;
    subtractFeeFromAmount: boolean;
    description: string;
    creationDate: Date;
    receiverAddress: string;
}

export interface InvoiceSuccessful extends InvoiceCommon {
    paidBy: string;
    status: 'success';
}

export interface InvoiceNotSuccessful extends InvoiceCommon {
    status: Exclude<InvoiceStatus, 'success'>;
}

export type Invoice = InvoiceNotSuccessful | InvoiceSuccessful;
