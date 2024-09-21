import { makeAutoObservable, reaction } from 'mobx';
import { Loadable, tonApiClient } from 'src/shared';
import { Address } from '@ton/core';
import { JettonBalance, JettonInfo } from '@ton-api/client';

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
                    this.fetchJettonInfo();
                } else {
                    this.jettonInfo$.setValue(null);
                }
            }
        );

        reaction(
            () => [this.jettonAddress, this.showWalletAddress],
            ([jettonAddress, userAddress]) => {
                if (jettonAddress && userAddress) {
                    this.fetchJettonWallet();
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

    private fetchJettonInfo = this.jettonInfo$.createAsyncAction(
        async () => {
            if (!this.jettonAddress) {
                return null;
            }

            return tonApiClient.jettons.getJettonInfo(this.jettonAddress).catch(e => {
                if (e.response?.status === 404) {
                    return null;
                }
                throw e;
            });
        },
        {
            onError: e => this.jettonInfo$.setErroredState(e)
        }
    );

    private fetchJettonWallet = this.jettonWallet$.createAsyncAction(
        async () => {
            if (!this.jettonAddress || !this.showWalletAddress) {
                return null;
            }

            return tonApiClient.accounts
                .getAccountJettonBalance(this.showWalletAddress, this.jettonAddress)
                .then(res => {
                    if (res.balance === '') {
                        // TODO: remove that after API fix
                        return null;
                    }
                    return res;
                })
                .catch(e => {
                    if (e.response?.status === 404) {
                        return null;
                    }
                    return null; // TODO: remove that after API fix, not error on parse empty address
                    // throw e;
                });
        },
        {
            onError: e => this.jettonWallet$.setErroredState(e)
        }
    );

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
