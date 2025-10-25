import { makeAutoObservable } from 'mobx';
import {
    createAsyncAction,
    createImmediateReaction,
    hasProperty,
    Loadable,
    testnetExplorer,
    TonCurrencyAmount
} from 'src/shared';
import { getTestnetAvailable, buyTestnetCoins } from 'src/shared/api';
import { createStandaloneToast } from '@chakra-ui/react';
import { projectsStore } from 'src/shared/stores';
import type { AxiosError } from 'axios';
import { RequestFaucetForm } from './interfaces';
import { tonapiTestnet } from 'src/shared/api/tonapi';

class FaucetStore {
    tonRate$ = new Loadable<number>(0);

    tonSupply$ = new Loadable<TonCurrencyAmount | null>(null);

    latestPurchase: { amount: TonCurrencyAmount; link: string } | null = null;

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                if (project) {
                    this.fetchTonSupplyAndRate();
                }
            }
        );
    }

    fetchTonSupplyAndRate = this.tonSupply$.createAsyncAction(
        async () => {
            this.tonRate$.setStartLoading();
            const { data, error } = await getTestnetAvailable();
            if (error) throw error;
            // TODO: PRICES remove this after backend will be updated
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.tonRate$.value = 1 / data.price_multiplicator;
            this.tonRate$.setEndLoading();
            return new TonCurrencyAmount(data.balance);
        },
        {
            onError: e => this.tonRate$.setErroredState(e)
        }
    );

    buyAssets = createAsyncAction(
        async (form: RequestFaucetForm) => {
            this.latestPurchase = null;

            const { data, error } = await buyTestnetCoins({
                query: { project_id: projectsStore.selectedProject!.id },
                body: { address: form.receiverAddress, coins: form.amount.weiAmount.toNumber() }
            });

            if (error) throw error;

            const [hash] = await Promise.all([
                fetchTxHash(data.hash),
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
    return tonapiTestnet.blockchain
        .getBlockchainTransactionByMessageHash(msgHash)
        .then(data => data.hash)
        .catch(e => {
            if (hasProperty(e, 'message') && e.message === 'transaction not found') {
                if (attempt > 20) {
                    throw new Error('Tx not found');
                }
                return new Promise(r => setTimeout(r, 1500)).then(() =>
                    fetchTxHash(msgHash, attempt + 1)
                );
            }

            throw e;
        });
}

export const faucetStore = new FaucetStore();
