/* eslint-disable max-classes-per-file */

import { apiClient, Loadable } from 'src/shared';
import { ADAirdropData, ADDistributorData, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { toNano } from '@ton/ton';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';
import { getAirdropStatus, AirdropStatusT } from 'src/pages/jetton/airdrops/airdrop/deployUtils';

export type AirdropFullT = ADAirdropData & {
    name: string;
    status: AirdropStatusT;
};

export class AirdropStore {
    airdrop$ = new Loadable<AirdropFullT | null>(null);

    distributors$ = new Loadable<ADDistributorData[]>([]);

    private readonly projectId: number;

    private readonly airdrops: { api_id: string; name: string }[];

    constructor({
        projectId,
        airdrops
    }: {
        projectId: number;
        airdrops: { api_id: string; name: string }[];
    }) {
        makeAutoObservable(this);
        this.projectId = projectId;
        this.airdrops = airdrops;
    }

    createAirdrop = async ({
        adminAddress,
        address,
        fee,
        vesting,
        name
    }: AirdropMetadata & { adminAddress: string }) => {
        if (vesting?.length && vesting.some(i => !i.unlockTime || !i.fraction)) {
            throw new Error('Vesting parameters are invalid');
        } // TODO: add guard function

        const airdropRes = await airdropApiClient.v2
            .newAirdrop(
                { project_id: `${this.projectId}` },
                {
                    admin: adminAddress,
                    jetton: address,
                    royalty_parameters: { min_commission: toNano(fee).toString() },
                    vesting_parameters: !!vesting?.length
                        ? {
                              unlocks_list: vesting.map(i => ({
                                  unlock_time: Math.floor(new Date(i.unlockTime!).getTime() / 1000), // TODO:remove not null
                                  fraction: i.fraction! * 100 // TODO:remove not null
                              }))
                          }
                        : undefined
                }
            )
            .then(({ data }) => data);

        const consoleRes = await apiClient.api
            .createJettonAirdrop(
                { project_id: this.projectId },
                { api_id: airdropRes.id, name: name }
            )
            .then(({ data }) => data);

        this.airdrops.push(consoleRes.airdrop);

        return consoleRes.airdrop.api_id;
    };

    loadAirdrop = this.airdrop$.createAsyncAction(async (id: string) => {
        const airdrop = await airdropApiClient.v2
            .getAirdropData({ id, project_id: `${this.projectId}` })
            .then(({ data }) => data);

        const distributors = await airdropApiClient.v2
            .getDistributorsData({
                id,
                project_id: `${this.projectId}`
            })
            .then(({ data }) => data.distributors);

        this.distributors$.value = distributors;

        const current = this.airdrops.find(i => i.api_id === id);
        if (!current) {
            throw new Error('Airdrop not found in local store');
        }

        const status = getAirdropStatus(airdrop, distributors);

        const data: AirdropFullT = {
            ...airdrop,
            name: current.name,
            status: status
        };

        return data;
    });

    loadDistributors = this.distributors$.createAsyncAction(async (id: string) => {
        const distributors = await airdropApiClient.v2
            .getDistributorsData({
                id,
                project_id: `${this.projectId}`
            })
            .then(({ data }) => data.distributors);

        return distributors;
    });

    switchClaim = async (id: string, type: 'enable' | 'disable') => {
        const methodClaim =
            type === 'enable' ? airdropApiClient.v2.openClaim : airdropApiClient.v2.closeClaim;

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

// Depricated class for old airdrop API
export class AirdropOldStore {
    airdrop$ = new Loadable<AirdropFullT | null>(null);

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

        const data: AirdropFullT = {
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
