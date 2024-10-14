import { makeAutoObservable } from 'mobx';
import {
    Loadable,
    createAsyncAction,
    setIntervalWhenPageOnFocus,
    CRYPTO_CURRENCY
} from 'src/shared';
import { Rates$ } from './interfaces';
import BigNumber from 'bignumber.js';
import { fetchRate } from './rates.api';

class RatesStore {
    rates$: Rates$ = {
        [CRYPTO_CURRENCY.TON]: new Loadable<BigNumber>(new BigNumber(0)),
        [CRYPTO_CURRENCY.USDT]: new Loadable<BigNumber>(new BigNumber(0))
    };

    constructor() {
        makeAutoObservable(this);

        this.fetchRates();

        setIntervalWhenPageOnFocus(() => this.fetchRates({ silently: true }), 60000);
    }

    fetchRate = createAsyncAction(
        async (currency: CRYPTO_CURRENCY, options?: { silently: boolean }) => {
            const currencyRate = this.rates$[currency];
            try {
                if (!options?.silently) {
                    currencyRate.setStartLoading();
                }

                const price = await fetchRate(currency);

                currencyRate.setValue(price);

                if (!options?.silently) {
                    currencyRate.setEndLoading();
                }
            } catch (e) {
                if (!options?.silently) {
                    currencyRate.setErroredState(e);
                }
            }
        }
    );

    fetchRates = createAsyncAction(async (options?: { silently: boolean }) => {
        await Promise.all(
            Object.keys(this.rates$).map(currency =>
                this.fetchRate(currency as CRYPTO_CURRENCY, options)
            )
        );
    });

    clearState(): void {
        Object.values(this.rates$).forEach(v => v.clear());
    }
}
export const ratesStore = new RatesStore();
