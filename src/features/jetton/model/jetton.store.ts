import { makeAutoObservable, reaction } from 'mobx';
import { Loadable, tonApiClient } from 'src/shared';
import { Address, toNano } from '@ton/core';
import { JettonBalance, JettonInfo } from '@ton-api/client';
import { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui-react';
import { burn } from '../lib/jetton-minter';
import { sleep } from '../lib/utils';

export class JettonStore {
    jettonAddress: Address | null = null;

    connectedWalletAddress: Address | null = null;

    showWalletAddress: Address | null = null;

    jettonInfo$ = new Loadable<JettonInfo | null>(null);

    jettonWallet$ = new Loadable<JettonBalance | null>(null);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.connectedWalletAddress,
            connectedWalletAddress => this.setShowWalletAddress(connectedWalletAddress)
        );

        reaction(
            () => this.jettonAddress,
            jettonAddress => {
                if (jettonAddress) {
                    this.updateJettonInfo();
                } else {
                    this.jettonInfo$.setValue(null);
                }
            }
        );

        reaction(
            () => [this.jettonAddress, this.showWalletAddress],
            ([jettonAddress, userAddress]) => {
                if (jettonAddress && userAddress) {
                    this.updateJettonWallet();
                } else {
                    this.jettonWallet$.setValue(null);
                }
            }
        );
    }

    get isOwner() {
        return (
            this.jettonAddress !== null &&
            this.connectedWalletAddress !== null &&
            this.jettonInfo$.value?.admin?.address.equals(this.connectedWalletAddress)
        );
    }

    private async fetchJettonInfo(jettonAddress: Address) {
        return tonApiClient.jettons.getJettonInfo(jettonAddress).catch(e => {
            if (e.status === 404) {
                return null;
            }
            throw e;
        });
    }

    updateJettonInfo = this.jettonInfo$.createAsyncAction(
        async () => {
            if (!this.jettonAddress) {
                return null;
            }

            this.updateJettonWallet();

            return this.fetchJettonInfo(this.jettonAddress);
        },
        {
            onError: e => this.jettonInfo$.setErroredState(e)
        }
    );

    private async fetchJettonWallet(jettonAddress: Address, showWalletAddress: Address) {
        return tonApiClient.accounts
            .getAccountJettonBalance(showWalletAddress, jettonAddress)
            .then(res => {
                if (res.balance === '') {
                    // TODO: remove that after API fix
                    return null;
                }
                return res;
            })
            .catch(e => {
                if (e.status === 404) {
                    return null;
                }
                return null; // TODO: remove that after API fix, not error on parse empty address
                // throw e;
            });
    }

    private updateJettonWallet = this.jettonWallet$.createAsyncAction(
        async () => {
            if (!this.jettonAddress || !this.showWalletAddress) {
                return null;
            }

            return this.fetchJettonWallet(this.jettonAddress, this.showWalletAddress);
        },
        {
            onError: e => this.jettonWallet$.setErroredState(e)
        }
    );

    private async waiter<T>(fetcher: () => Promise<T>, waitConditionChecker: (v: T) => boolean) {
        for (let attempt = 0; attempt < 25; attempt++) {
            await sleep(3000);
            const res = await fetcher();
            if (waitConditionChecker(res)) return;
        }
        throw new Error('Timeout');
    }

    async burnJetton(amount: bigint, tonConnection: TonConnectUI) {
        const jettonWallet = this.jettonWallet$.value;

        if (!jettonWallet || !this.connectedWalletAddress) {
            throw new Error('Jetton address or connected wallet address is not set');
        }

        const supplyFetcher = async () =>
            this.fetchJettonInfo(jettonWallet.jetton.address).then(v =>
                v ? BigInt(v.totalSupply) : null
            );

        const beforeTotalSupply = await supplyFetcher();

        if (!beforeTotalSupply) {
            throw new Error('Jetton cannot be existed');
        }

        const jettonWalletAddress = jettonWallet.walletAddress.address;

        const tx: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: jettonWalletAddress.toString(),
                    amount: toNano(0.031).toString(),
                    stateInit: undefined,
                    payload: burn(amount, this.connectedWalletAddress).toBoc().toString('base64')
                }
            ]
        };

        await tonConnection.sendTransaction(tx);

        await this.waiter(supplyFetcher, v => v === beforeTotalSupply - amount);
    }

    setJettonAddress(address: Address | null) {
        this.jettonAddress = address;
    }

    setShowWalletAddress(address: Address | null) {
        this.showWalletAddress = address;
    }

    setConnectedWalletAddress(address: Address | null) {
        this.connectedWalletAddress = address;
    }
}

export const jettonStore = new JettonStore();
