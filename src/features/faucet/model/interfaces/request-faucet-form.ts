import { TokenCurrencyAmount } from 'src/shared';

export interface RequestFaucetForm {
    amount: TokenCurrencyAmount;

    receiverAddress: string;
}
