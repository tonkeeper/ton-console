import { CRYPTO_CURRENCY, TokenCurrencyAmount, TonAddress } from 'src/shared';

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
    currency: CRYPTO_CURRENCY;
    validUntil: Date;
    description: string;
    creationDate: Date;
    payTo: TonAddress;
    paymentLink: string;
    overpayment?: TokenCurrencyAmount;
}

export interface InvoiceSuccessful extends InvoiceCommon {
    paidBy: TonAddress;
    paymentDate: Date;
    status: 'success';
}

export interface InvoiceCancelled extends InvoiceCommon {
    status: 'cancelled';
    cancellationDate: Date;
}

export interface InvoiceExpired extends InvoiceCommon {
    status: 'expired';
}

export interface InvoicePending extends InvoiceCommon {
    status: 'pending';
}

export type Invoice = InvoicePending | InvoiceSuccessful | InvoiceCancelled | InvoiceExpired;
