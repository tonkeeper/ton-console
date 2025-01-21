import {
    apiClient,
    createImmediateReaction,
    DTOJettonAirdrop,
    Loadable
    // Network
} from 'src/shared';
import { ADAirdropData, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { projectsStore } from 'src/entities';
import { toNano } from '@ton/ton';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';
import { getAirdropStatus, AirdropStatusT } from 'src/pages/jetton/airdrop/deployUtils';

type AirdropFullT = ADAirdropData & {
    name: string;
    status: AirdropStatusT;
};

export class AirdropStore {
    airdrop$ = new Loadable<AirdropFullT | null>(null);

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

    createAirdrop = async (v: AirdropMetadata & { adminAddress: string }) => {
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

        this.airdrops$.value.push(consoleRes.airdrop);

        return consoleRes.airdrop.api_id;
    };

    loadAirdrop = this.airdrop$.createAsyncAction(async (id: string) => {
        const airdrop = await airdropApiClient.v1
            .getAirdropData({ id, project_id: `${projectsStore.selectedProject!.id}` })
            .then(v => v.data);
        const distributors = await airdropApiClient.v1
            .getDistributorsData({
                id,
                project_id: `${projectsStore.selectedProject!.id}`
            })
            .then(v => v.data.distributors);

        const current = this.airdrops$.value.find(i => i.api_id === id)!;
        const status = getAirdropStatus(airdrop, distributors);

        const data: AirdropFullT = {
            ...airdrop,
            name: current.name,
            status: status
        };

        console.log(data);

        return data;
    });

    loadDistributors = async (id: string) => {
        const res = await airdropApiClient.v1
            .getDistributorsData({
                id,
                project_id: `${projectsStore.selectedProject!.id}`
            })
            .then(data => data.data.distributors);

        return res;
    };

    switchClaim = async (id: string, type: 'enable' | 'disable') => {
        if (type === 'enable') {
            await airdropApiClient.v1
                .openClaim({
                    id,
                    project_id: `${projectsStore.selectedProject!.id}`
                })
                .then(d => {
                    console.log(d);
                })
                .finally(async () => {
                    await this.loadAirdrop(id);
                });
        } else {
            await airdropApiClient.v1
                .closeClaim({
                    id,
                    project_id: `${projectsStore.selectedProject!.id}`
                })
                .then(d => {
                    console.log(d);
                })
                .finally(async () => {
                    await this.loadAirdrop(id);
                });
        }
    };

    clearAirdrop() {
        this.airdrop$.clear();
    }

    clearStore() {
        this.airdrops$.clear();
    }
}

export const airdropsStore = new AirdropStore();
