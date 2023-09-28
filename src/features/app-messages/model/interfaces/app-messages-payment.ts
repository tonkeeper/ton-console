import { TonCurrencyAmount, UsdCurrencyAmount } from 'src/shared';
import { AppMessagesPackage } from './app-messages-package';

export interface AppMessagesPayment {
    id: string;
    package: AppMessagesPackage;
    amount: TonCurrencyAmount;
    amountUsdEquivalent: UsdCurrencyAmount;

    date: Date;
}
