import { Loadable } from 'src/shared';
import { ADAirdropData, ADDistributorData, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { getAirdropStatus, AirdropStatusT } from 'src/pages/jetton/airdrops/airdrop/deployUtils';

export type AirdropOldFullT = ADAirdropData & {
    name: string;
    status: AirdropStatusT;
};

export class AirdropOldStore {
    airdrop$ = new Loadable<AirdropOldFullT | null>(null);

    distributors$ = new Loadable<ADDistributorData[]>([]);

    private readonly projectId: number;

    constructor({ projectId }: { projectId: number }) {
        makeAutoObservable(this);
        this.projectId = projectId;
    }

    loadAirdrop = this.airdrop$.createAsyncAction(async (id: string) => {
        const airdrop = await airdropApiClient.v1
            .getAirdropData({ id, project_id: `${this.projectId}` })
            .then(v => v.data);

        const distributors = await airdropApiClient.v1
            .getDistributorsData({
                id,
                project_id: `${this.projectId}`
            })
            .then(v => v.data.distributors);

        this.distributors$.value = distributors;

        const status = getAirdropStatus(airdrop, distributors);

        const data: AirdropOldFullT = {
            ...airdrop,
            name: 'Legacy airdrop',
            status: status
        };

        return data;
    });

    loadDistributors = this.distributors$.createAsyncAction(async (id: string) => {
        const distributors = await airdropApiClient.v1
            .getDistributorsData({
                id,
                project_id: `${this.projectId}`
            })
            .then(({ data }) => data.distributors);

        return distributors;
    });

    switchClaim = async (id: string, type: 'enable' | 'disable') => {
        const methodClaim =
            type === 'enable' ? airdropApiClient.v1.openClaim : airdropApiClient.v1.closeClaim;

        await methodClaim({
            id,
            project_id: `${this.projectId}`
        }).finally(() => this.loadAirdrop(id));
    };

    clearAirdrop() {
        this.airdrop$.clear();
        this.distributors$.clear();
    }
}
