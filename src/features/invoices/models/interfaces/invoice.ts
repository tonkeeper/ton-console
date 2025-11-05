import { Address } from '@ton/core';
import { CRYPTO_CURRENCY, TokenCurrencyAmount } from 'src/shared';

export const InvoiceStatus = {
    pending: 'pending',
    success: 'success',
    cancelled: 'cancelled',
    expired: 'expired'
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type InvoiceStatus = keyof typeof InvoiceStatus;

export const InvoiceCurrency = {
    [CRYPTO_CURRENCY.TON]: CRYPTO_CURRENCY.TON,
    [CRYPTO_CURRENCY.USDT]: CRYPTO_CURRENCY.USDT
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type InvoiceCurrency = keyof typeof InvoiceCurrency;

export interface InvoiceCommon {
    id: string;
    amount: TokenCurrencyAmount;
    currency: CRYPTO_CURRENCY;
    validUntil: Date;
    description: string;
    creationDate: Date;
    payTo: Address;
    paymentLink: string;
    overpayment?: TokenCurrencyAmount;
}

export interface InvoiceSuccessful extends InvoiceCommon {
    paidBy: Address;
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
