import { CurrencyAmount } from 'src/shared';
import { Refill } from 'src/entities';

export interface Portfolio {
    balances: CurrencyAmount[];

    refills: Refill[];
}
