import {
    apiClient,
    createImmediateReaction,
    DTOJettonAirdrop,
    Loadable
    // Network
} from 'src/shared';
import { airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { toNano } from '@ton/ton';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';

export class AirdropStore {
    airdrop$ = new Loadable<DTOJettonAirdrop | null>(null);

    airdrops$ = new Loadable<DTOJettonAirdrop[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearStore();

                if (project) {
                    this.fetchAirdrops();
                }
            }
        );
    }

    fetchAirdrops = this.airdrops$.createAsyncAction(async () => {
        const res = await apiClient.api
            .getJettonAirdrops({
                project_id: projectsStore.selectedProject!.id
            })
            .then(data => data.data.airdrops);

        return res;
    });

    createAirdrop = this.airdrops$.createAsyncAction(
        async (v: AirdropMetadata & { adminAddress: string }) => {
            const airdropRes = await airdropApiClient.v1
                .newAirdrop(
                    { project_id: `${projectsStore.selectedProject!.id}` },
                    {
                        admin: v.adminAddress,
                        jetton: v.address,
                        royalty_parameters: { min_commission: toNano(v.fee).toString() }
                    }
                )
                .then(data => data.data);

            const consoleRes = await apiClient.api
                .createJettonAirdrop(
                    { project_id: projectsStore.selectedProject!.id },
                    { api_id: airdropRes.id, name: v.name }
                )
                .then(data => data.data);

            this.airdrops$.value.unshift(consoleRes.airdrop);

            return consoleRes.airdrop.id;
        }
    );

    loadAirdrop = this.airdrop$.createAsyncAction(async (id: string) => {
        const airdrop = await airdropApiClient.v1
            .getAirdropData({ id, project_id: `${projectsStore.selectedProject!.id}` })
            .then(v => v.data);

        console.log(airdrop);

        return airdrop;
    });

    clearStore() {
        this.airdrops$.clear();
    }
}

export const airdropsStore = new AirdropStore();
