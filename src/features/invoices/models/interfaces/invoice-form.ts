import { TokenCurrencyAmount } from 'src/shared';

export interface InvoiceForm {
    amount: TokenCurrencyAmount;

    lifeTimeSeconds: number;

    description: string;
}
