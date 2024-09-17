import { makeAutoObservable } from 'mobx';
import { JettonData, JettonDeployController } from '../lib/deploy-controller';
import { Loadable } from 'src/shared';
import { Address } from '@ton/core';

export class JettonStore {
    jettonMasterAddress: Address | null = null;

    jettonData$ = new Loadable<JettonData | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    fetchJettonDetails = this.jettonData$.createAsyncAction(
        async (userAddress: Address) => {
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

    setJettonMasterAddress(jettonAddress: Address, userAddress: Address) {
        this.jettonMasterAddress = jettonAddress;
        this.fetchJettonDetails(userAddress);
    }
}
