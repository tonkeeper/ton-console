import { makeAutoObservable } from 'mobx';
import { JettonData, JettonDeployController } from '../lib/deploy-controller';
import { Loadable } from 'src/shared';
import { Address } from '@ton/core';

export class JettonStore {
    jettonMasterAddress = Address.parse('EQAQBGCWuLOTVyGdFGnF5UN19jOKdsM7F-s_Jb-94jI7Oaco');

    jettonData$ = new Loadable<JettonData | null>(null);

    constructor() {
        makeAutoObservable(this);
    }

    fetchJettonDetails = this.jettonData$.createAsyncAction(
        async (userAddress: Address) => {
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
