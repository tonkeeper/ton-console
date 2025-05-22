import { makeAutoObservable, reaction } from 'mobx';
import { Loadable, tonapiClient } from 'src/shared';
import { Address, toNano, Cell } from '@ton/core';
import { JettonBalance, JettonInfo, JettonMetadata as ApiJettonMetadata } from '@ton-api/client';
import { SendTransactionRequest, TonConnectUI } from '@tonconnect/ui-react';
import {
    JettonMetadata,
    buildJettonOnchainMetadata,
    burnBody,
    changeAdminBody,
    mintBody,
    readJettonMetadata,
    updateMetadataBody
} from '../lib/jetton-minter';
import { sleep, zeroAddress } from '../lib/utils';

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
        const jettonInfo = await tonapiClient.jettons.getJettonInfo(jettonAddress).catch(e => {
            if (e.status === 404) {
                return null;
            }
            throw e;
        });

        // FIXME: remove that after API fix
        if (!jettonInfo) {
            return null;
        }

        const jettonMetadataFromBlockchainContent = await tonapiClient.blockchain
            .execGetMethodForBlockchainAccount(jettonAddress, 'get_jetton_data')
            .then(v => v.decoded.jetton_content)
            .then(v => Cell.fromBoc(Buffer.from(v, 'hex')))
            .then(async v => {
                const pop = v.pop();
                return pop && (await readJettonMetadata(pop));
            })
            .then(v => v?.metadata);

        const preparedMetadataFromBlockchainContent: Partial<ApiJettonMetadata> = {
            name: jettonMetadataFromBlockchainContent?.name,
            symbol: jettonMetadataFromBlockchainContent?.symbol,
            decimals: jettonMetadataFromBlockchainContent?.decimals,
            image: jettonMetadataFromBlockchainContent?.image,
            description: jettonMetadataFromBlockchainContent?.description
        };

        return {
            ...jettonInfo,
            metadata: {
                ...jettonInfo.metadata,
                ...preparedMetadataFromBlockchainContent
            }
        };
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
        return tonapiClient.accounts
            .getAccountJettonBalance(showWalletAddress, jettonAddress)
            .catch(e => {
                if (e.status === 404) return null;
                throw e;
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
                    payload: burnBody(amount, this.connectedWalletAddress)
                        .toBoc()
                        .toString('base64')
                }
            ]
        };

        await tonConnection.sendTransaction(tx);

        await this.waiter(supplyFetcher, v => v === beforeTotalSupply - amount);
    }

    async mintJetton(amount: bigint, tonConnection: TonConnectUI) {
        const jettonWallet = this.jettonWallet$.value;

        if (!jettonWallet || !this.connectedWalletAddress || !this.jettonAddress) {
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

        const tx: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: this.jettonAddress.toString(),
                    amount: toNano(0.031).toString(),
                    stateInit: undefined,
                    payload: mintBody(this.connectedWalletAddress, amount, toNano(0.02), 0n)
                        .toBoc()
                        .toString('base64')
                }
            ]
        };

        await tonConnection.sendTransaction(tx);

        await this.waiter(supplyFetcher, v => v === beforeTotalSupply + amount);
    }

    async burnAdmin(tonConnection: TonConnectUI) {
        const jettonWallet = this.jettonWallet$.value;

        if (!jettonWallet || !this.connectedWalletAddress || !this.jettonAddress) {
            throw new Error('Jetton address or connected wallet address is not set');
        }

        const supplyFetcher = async () =>
            this.fetchJettonInfo(jettonWallet.jetton.address).then(v => v?.admin?.address ?? null);

        const tx: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: this.jettonAddress.toString(),
                    amount: toNano(0.01).toString(),
                    stateInit: undefined,
                    payload: changeAdminBody(zeroAddress()).toBoc().toString('base64')
                }
            ]
        };

        await tonConnection.sendTransaction(tx);
        await this.waiter(supplyFetcher, v => v?.equals(zeroAddress()) ?? false);
    }

    async updateMetadata(data: JettonMetadata, tonConnection: TonConnectUI) {
        const jettonWallet = this.jettonWallet$.value;

        if (!jettonWallet || !this.connectedWalletAddress || !this.jettonAddress) {
            throw new Error('Jetton address or connected wallet address is not set');
        }

        const supplyFetcher = async () =>
            this.fetchJettonInfo(jettonWallet.jetton.address).then(v => (v ? v.metadata : null));

        const metadata = await buildJettonOnchainMetadata(data);

        const tx: SendTransactionRequest = {
            validUntil: Date.now() + 5 * 60 * 1000,
            messages: [
                {
                    address: this.jettonAddress.toString(),
                    amount: toNano(0.01).toString(),
                    stateInit: undefined,
                    payload: updateMetadataBody(metadata).toBoc().toString('base64')
                }
            ]
        };

        await tonConnection.sendTransaction(tx);

        await this.waiter(supplyFetcher, v => {
            if (!v) return false;

            return (
                v.name === data.name &&
                v.symbol === data.symbol &&
                v.decimals === data.decimals &&
                v.image === data.image &&
                v.description === data.description
            );
        });
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
