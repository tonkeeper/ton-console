import { TokenCurrencyAmount } from 'src/shared';

export const InvoiceStatus = {
    pending: 'pending',
    success: 'success',
    cancelled: 'cancelled',
    expired: 'expired'
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type InvoiceStatus = keyof typeof InvoiceStatus;

export interface InvoiceCommon {
    id: string;
    amount: TokenCurrencyAmount;
    validUntil: Date;
    description: string;
    creationDate: Date;
    payTo: string;
    overpayment?: TokenCurrencyAmount;
    refundDate?: Date;
    refundedAmount?: TokenCurrencyAmount;
}

export interface InvoiceSuccessful extends InvoiceCommon {
    paidBy: string;
    paymentDate: Date;
    status: 'success';
}

export interface InvoiceNotSuccessful extends InvoiceCommon {
    status: Exclude<InvoiceStatus, 'success'>;
}

export type Invoice = InvoiceNotSuccessful | InvoiceSuccessful;
