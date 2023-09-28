import { UsdCurrencyAmount } from 'src/shared';

export interface AppMessagesPackage {
    id: number;
    price: UsdCurrencyAmount;
    messagesIncluded: number;
    name: string;
}
