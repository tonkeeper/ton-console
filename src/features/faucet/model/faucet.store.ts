import { makeAutoObservable, untracked } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    createEffect,
    createImmediateReaction,
    DTOCharge,
    Loadable,
    setIntervalWhenPageOnFocus,
    testnetExplorer,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { createStandaloneToast } from '@chakra-ui/react';
import { projectsStore } from 'src/entities';
import type { AxiosError } from 'axios';
import { FaucetPayment, RequestFaucetForm } from './interfaces';
import BigNumber from 'bignumber.js';

class FaucetStore {
    tonRate$ = new Loadable<number>(0);

    tonSupply$ = new Loadable<TonCurrencyAmount | null>(null);

    paymentsHistory$ = new Loadable<FaucetPayment[]>([]);

    latestPurchase: { amount: TonCurrencyAmount; link: string } | null = null;

    constructor() {
        makeAutoObservable(this);

        let dispose: (() => void) | undefined;

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                dispose?.();
                if (project) {
                    dispose = setIntervalWhenPageOnFocus(this.fetchTonSupplyAndRate, 5000);
                }
            }
        );

        createEffect(() => {
            if (this.tonRate$.isResolved && projectsStore.selectedProject) {
                untracked(this.fetchPaymentsHistory);
            } else {
                this.paymentsHistory$.clear();
            }
        });
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

    fetchPaymentsHistory = this.paymentsHistory$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectTestnetPaymentsHistory({
            project_id: projectsStore.selectedProject!.id
        });

        return response.data.history
            .map(item => mapDTOPaymentToTonApiPayment(this.tonRate$.value, item))
            .filter(i => !!i) as FaucetPayment[];
    });

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

            this.fetchPaymentsHistory();

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

function mapDTOPaymentToTonApiPayment(tonRate: number, payment: DTOCharge): FaucetPayment | null {
    const tonAmount = new TonCurrencyAmount(payment.amount);

    return {
        id: payment.id,
        date: new Date(payment.date_create),
        amount: tonAmount,
        boughtAmount: new TonCurrencyAmount(
            new BigNumber(payment.amount).multipliedBy(
                payment.testnet_price_multiplicator || tonRate
            )
        ),
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(payment.exchange_rate)
        )
    };
}
export const faucetStore = new FaucetStore();
