import { CRYPTO_CURRENCY, TokenCurrencyAmount } from 'src/shared';

export interface InvoiceForm {
    amount: TokenCurrencyAmount;

    lifeTimeSeconds: number;

    description: string;

    currency: CRYPTO_CURRENCY;
}
