/* eslint-disable max-classes-per-file */

import { Loadable } from 'src/shared';
import { createJettonAirdrop } from 'src/shared/api';
import { ADAirdropData, ADDistributorData, airdropApiClient } from 'src/shared/api/airdrop-api';
import { makeAutoObservable } from 'mobx';
import { toNano } from '@ton/ton';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';
import { getAirdropStatus, AirdropStatusT } from '../lib/deploy-utils';

export type AirdropFullT = ADAirdropData & {
    name: string;
    status: AirdropStatusT;
};

interface ValidVestingItem {
    unlockTime: string;
    fraction: number;
}

type ValidVesting = ValidVestingItem[];

function isValidVesting(
    vesting: Array<{ unlockTime?: string; fraction?: number }> | null
): vesting is ValidVesting {
    if (!vesting?.length) return true;

    return vesting.every(i => i.unlockTime || typeof i.fraction === 'number');
}

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
        if (!isValidVesting(vesting)) {
            throw new Error(
                'Vesting parameters are invalid: all items must have unlockTime and fraction fields'
            );
        }

        const airdropRes = await airdropApiClient.v2
            .newAirdrop(
                { project_id: `${this.projectId}` },
                {
                    admin: adminAddress,
                    jetton: address,
                    royalty_parameters: { min_commission: toNano(fee).toString() },
                    vesting_parameters: !!vesting?.length
                        ? {
                              unlocks_list: vesting.map(item => ({
                                  unlock_time: Math.floor(
                                      new Date(item.unlockTime).getTime() / 1000
                                  ),
                                  fraction: item.fraction * 100
                              }))
                          }
                        : undefined
                }
            )
            .then(({ data }) => data);

        const { data: consoleRes, error } = await createJettonAirdrop({
            query: { project_id: this.projectId },
            body: { api_id: airdropRes.id, name: name }
        });

        if (error) throw error;

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
