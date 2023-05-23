import { TokenCurrencyAmount } from 'src/shared';

export interface InvoiceForm {
    amount: TokenCurrencyAmount;

    subtractFeeFromAmount: boolean;

    lifeTimeSeconds: number;

    description: string;

    receiverAddress: string;
}