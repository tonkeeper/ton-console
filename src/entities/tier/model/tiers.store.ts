import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { apiClient, getWindow, DTOTier, createEffect } from 'src/shared';
import { Tier } from './interfaces';
import { tGUserStore } from 'src/entities';

class TiersStore {
    tiers: Tier[] = [];

    isLoading = false;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'TiersStore',
            properties: ['tiers'],
            storage: getWindow()!.localStorage
        });

        createEffect(() => {
            if (tGUserStore.user) {
                this.fetchTiers();
            }
        });
    }

    fetchTiers = async (): Promise<void> => {
        this.isLoading = true;

        try {
            const tiers = await apiClient.api.getTiers();

            this.tiers = tiers.data.items.map(mapTierDTOToTier);
        } catch (e) {
            console.error(e);
        }

        this.isLoading = false;
    };
}

function mapTierDTOToTier(tierDTO: DTOTier): Tier {
    return {
        id: tierDTO.id,
        name: tierDTO.name,
        tonPrice: tierDTO.ton_price / 10 ** 9,
        description: {
            requestsPerSecondLimit: tierDTO.rpc,
            connections: {
                accountsLimit: tierDTO.burst,
                subscriptionsLimit: tierDTO.burst
            }
        }
    };
}

export const tiersStore = new TiersStore();
