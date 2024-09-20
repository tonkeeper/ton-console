import { computed, makeAutoObservable, observable } from 'mobx';
import { JettonData, JettonDeployController } from '../lib/deploy-controller';
import { Loadable } from 'src/shared';
import { Address } from '@ton/core';

export class JettonStore {
    jettonMasterAddress: Address | null = null;

    jettonData$ = new Loadable<JettonData | null>(null);

    constructor() {
        makeAutoObservable(this, {
            jettonData$: observable,
            wallet: computed
        });
    }

    get wallet() {
        return this.jettonData$.value?.jettonWallet ?? null;
    }

    fetchJettonDetails = this.jettonData$.createAsyncAction(
        async (userAddress: Address | null) => {
            if (!this.jettonMasterAddress) {
                throw new Error('Jetton master address is not set');
            }

            const response = await JettonDeployController.getJettonDetails(
                this.jettonMasterAddress,
                userAddress
            );
            return response;
        },
        {
            onError: e => this.jettonData$.setErroredState(e)
        }
    );

    setJettonMasterAddress(jettonAddress: Address, userAddress: Address | null) {
        this.jettonMasterAddress = jettonAddress;
        this.fetchJettonDetails(userAddress);
    }
}
