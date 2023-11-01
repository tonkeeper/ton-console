import { CurrencyAmount, TonAddress } from 'src/shared';

export interface RefillBasic {
    id: number;
    date: Date;
    amount: CurrencyAmount;
}

export interface RefillDeposit extends RefillBasic {
    type: 'deposit';
    fromAddress: TonAddress;
}

export interface RefillPromoCode extends RefillBasic {
    type: 'promoCode';
}

export type Refill = RefillDeposit | RefillPromoCode;
