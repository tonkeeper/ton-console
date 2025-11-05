import { CRYPTO_CURRENCY, DTOCryptoCurrency, TokenCurrencyAmount } from 'src/shared';
import { CRYPTO_CURRENCY_DECIMALS } from 'src/shared/lib/currency/CRYPTO_CURRENCY';
import type { DTOInvoicesApp, DTOInvoicesInvoice, GetInvoicesStatsResponse } from 'src/shared/api';
import type { InvoicesApp, InvoicesStatistics, Invoice } from './interfaces';
import { Address } from '@ton/core';

export const convertDTOCryptoCurrencyToCryptoCurrency = (
    currency: DTOCryptoCurrency
): CRYPTO_CURRENCY => {
    switch (currency) {
        case DTOCryptoCurrency.TON:
            return CRYPTO_CURRENCY.TON;
        case DTOCryptoCurrency.USDT:
            return CRYPTO_CURRENCY.USDT;
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
};

export const convertCryptoCurrencyToDTOCryptoCurrency = (
    currency: CRYPTO_CURRENCY
): DTOCryptoCurrency => {
    switch (currency) {
        case CRYPTO_CURRENCY.TON:
            return DTOCryptoCurrency.TON;
        case CRYPTO_CURRENCY.USDT:
            return DTOCryptoCurrency.USDT;
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
};

export const getTokenCurrencyAmountFromDTO = (
    amount: string | number,
    currency: DTOCryptoCurrency
): TokenCurrencyAmount => {
    return new TokenCurrencyAmount({
        weiAmount: amount.toString(),
        currency: convertDTOCryptoCurrencyToCryptoCurrency(currency),
        decimals: CRYPTO_CURRENCY_DECIMALS[currency]
    });
};

/**
 * Map DTO InvoicesApp to domain model
 */
export function mapInvoicesAppDTOToInvoicesApp(invoicesAppDTO: DTOInvoicesApp): InvoicesApp {
    const receiverAddress = Address.parse(invoicesAppDTO.recipient_address);

    return {
        id: invoicesAppDTO.id,
        name: invoicesAppDTO.name,
        creationDate: new Date(invoicesAppDTO.date_create * 1000),
        receiverAddress,
        webhooks: (invoicesAppDTO.webhooks || []).map(w => ({ id: w.id, value: w.webhook }))
    };
}

/**
 * Map DTO InvoicesStatistics to domain model
 */
export function mapInvoicesStatsDTOToInvoicesStats(
    invoicesStatsDTO: GetInvoicesStatsResponse['stats'],
    currency: CRYPTO_CURRENCY
): InvoicesStatistics {
    return {
        totalInvoices: invoicesStatsDTO.total,
        earnedTotal: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.success_total.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        }),
        earnedLastWeek: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.success_in_week.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        }),
        invoicesInProgress: invoicesStatsDTO.invoices_in_progress,
        awaitingForPaymentAmount: new TokenCurrencyAmount({
            weiAmount: invoicesStatsDTO.total_amount_pending.toString(),
            currency: currency,
            decimals: CRYPTO_CURRENCY_DECIMALS[currency]
        })
    };
}

/**
 * Map DTO Invoice to domain model
 */
export function mapInvoiceDTOToInvoice(invoiceDTO: DTOInvoicesInvoice): Invoice {
    const common = {
        id: invoiceDTO.id,
        description: invoiceDTO.description,
        amount: getTokenCurrencyAmountFromDTO(invoiceDTO.amount, invoiceDTO.currency),
        currency: convertDTOCryptoCurrencyToCryptoCurrency(invoiceDTO.currency),
        validUntil: new Date(invoiceDTO.date_expire * 1000),
        creationDate: new Date(invoiceDTO.date_create * 1000),
        payTo: Address.parse(invoiceDTO.pay_to_address),
        paymentLink: invoiceDTO.payment_link,
        ...(invoiceDTO.overpayment && {
            overpayment: getTokenCurrencyAmountFromDTO(invoiceDTO.overpayment, invoiceDTO.currency)
        })
    };

    if (invoiceDTO.status === 'paid' && invoiceDTO.paid_by_address) {
        return {
            ...common,
            status: 'success',
            paidBy: Address.parse(invoiceDTO.paid_by_address),
            paymentDate: new Date(invoiceDTO.date_change * 1000)
        };
    } else if (invoiceDTO.status === 'cancelled') {
        return {
            ...common,
            status: 'cancelled',
            cancellationDate: new Date(invoiceDTO.date_change * 1000)
        };
    } else if (invoiceDTO.status === 'expired') {
        return {
            ...common,
            status: 'expired'
        };
    }

    // Default to pending
    return {
        ...common,
        status: 'pending'
    };
}
