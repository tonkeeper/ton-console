import { makeAutoObservable } from 'mobx';
import { Loadable, CURRENCY, createAsyncAction, setIntervalWhenPageOnFocus } from 'src/shared';
import { Rates$ } from './interfaces';
import BigNumber from 'bignumber.js';

class RatesStore {
    rates$: Rates$ = {
        [CURRENCY.TON]: new Loadable<BigNumber>(new BigNumber(0))
    };

    constructor() {
        makeAutoObservable(this);

        this.fetchRates();

        setIntervalWhenPageOnFocus(() => this.fetchRates({ silently: true }), 3000);
    }

    fetchRate = createAsyncAction(async (currency: CURRENCY, options?: { silently: boolean }) => {
        const currencyRate = this.rates$[currency];
        try {
            if (!options?.silently) {
                currencyRate.setStartLoading();
            }

            await new Promise(r => setTimeout(r, 1500));

            currencyRate.setValue(new BigNumber(2.2333131323414));

            if (!options?.silently) {
                currencyRate.setEndLoading();
            }
        } catch (e) {
            if (!options?.silently) {
                currencyRate.setErroredState(e);
            }
        }
    });

    fetchRates = createAsyncAction(async (options?: { silently: boolean }) => {
        await Promise.all(
            Object.keys(this.rates$).map(currency => this.fetchRate(currency as CURRENCY, options))
        );
    });

    clearState(): void {
        Object.values(this.rates$).forEach(v => v.clear());
    }
}
export const ratesStore = new RatesStore();
