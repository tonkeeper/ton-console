import { makeAutoObservable } from 'mobx';
import { Loadable, TonCurrencyAmount } from 'src/shared';

class FaucetStore {
    tonRate$ = new Loadable<number>(0);

    tonSupply$ = new Loadable<TonCurrencyAmount | null>(null);

    constructor() {
        makeAutoObservable(this);

        this.fetchTonRate();
        this.fetchTonSupply();
    }

    fetchTonRate = this.tonRate$.createAsyncAction(async () => {
        await new Promise(r => setTimeout(r, 1000));

        return 0.01;
    });

    fetchTonSupply = this.tonSupply$.createAsyncAction(async () => {
        await new Promise(r => setTimeout(r, 1000));

        return new TonCurrencyAmount(1000000000000);
    });
}

export const faucetStore = new FaucetStore();
