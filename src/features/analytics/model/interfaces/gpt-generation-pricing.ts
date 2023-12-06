import { TonCurrencyAmount } from 'src/shared';

export interface GptGenerationPricing {
    freeRequestsNumber: number;
    usedFreeRequest: number;
    requestPrice: TonCurrencyAmount;
}
