import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    Loadable,
    setIntervalWhenPageOnFocus,
    testnetExplorer,
    TonCurrencyAmount
} from 'src/shared';
import { RequestFaucetForm } from 'src/features';
import { createStandaloneToast } from '@chakra-ui/react';
import { projectsStore } from 'src/entities';
import type { AxiosError } from 'axios';

class FaucetStore {
    tonRate$ = new Loadable<number>(0);

    tonSupply$ = new Loadable<TonCurrencyAmount | null>(null);

    latestPurchase: { amount: TonCurrencyAmount; link: string } | null = null;

    constructor() {
        makeAutoObservable(this);

        setIntervalWhenPageOnFocus(this.fetchTonSupplyAndRate, 3000);
    }

    fetchTonSupplyAndRate = this.tonSupply$.createAsyncAction(
        async () => {
            this.tonRate$.setStartLoading();
            const response = await apiClient.api.getTestnetAvailable();
            this.tonRate$.value = 1 / response.data.price_multiplicator;
            this.tonRate$.setEndLoading();
            return new TonCurrencyAmount(response.data.balance);
        },
        {
            onError: e => this.tonRate$.setErroredState(e)
        }
    );

    buyAssets = createAsyncAction(
        async (form: RequestFaucetForm) => {
            this.latestPurchase = null;

            const result = await apiClient.api.buyTestnetCoins(
                { project_id: projectsStore.selectedProject!.id },
                { address: form.receiverAddress, coins: form.amount.weiAmount.toNumber() }
            );

            const [hash] = await Promise.all([
                fetchTxHash(result.data.hash),
                this.fetchTonSupplyAndRate()
            ]);
            this.latestPurchase = {
                amount: form.amount,
                link: testnetExplorer.transactionLink(hash)
            };

            const { toast } = createStandaloneToast();
            toast({
                title: 'Successfully bought testnet assets',
                status: 'success',
                isClosable: true
            });
        },
        e => {
            const { toast } = createStandaloneToast();
            let title = 'Unknown error';
            let description = 'Unknown api error happened. Try again later';

            if ((e as AxiosError<{ code: number }>)?.response?.data?.code === 3) {
                title = 'Only one request pre minute is allowed';
                description = 'Please wait few minutes and try again';
            }
            toast({
                title,
                description,
                status: 'error',
                isClosable: true
            });
        }
    );
}

async function fetchTxHash(msgHash: string, attempt = 0): Promise<string> {
    const response = await fetch(
        `${import.meta.env.VITE_TONAPI_TESTNET_BASE_URL}blockchain/messages/${msgHash}/transaction`
    );

    const data = await response.json();
    if (data.error === 'transaction not found') {
        if (attempt > 20) {
            throw new Error('Tx not found');
        }
        await new Promise(r => setTimeout(r, 1000));
        return fetchTxHash(msgHash);
    }
    return data.hash;
}

export const faucetStore = new FaucetStore();
