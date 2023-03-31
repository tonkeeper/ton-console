import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
    apiClient,
    getWindow,
    DTOTier,
    createEffect,
    TonCurrencyAmount,
    serializeState,
    deserializeState
} from 'src/shared';
import { TonApiTier } from './interfaces';
import { tGUserStore } from 'src/entities';

class TonApiTiersStore {
    tiers: TonApiTier[] = [];

    isLoading = false;

    error: unknown = null;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'TonApiTiersStore',
            properties: [
                {
                    key: 'tiers',
                    serialize: serializeState,
                    deserialize: deserializeState
                }
            ],
            storage: getWindow()!.localStorage
        });

        createEffect(() => {
            if (tGUserStore.user) {
                this.fetchTiers();
            } else {
                this.clearState();
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

    clearState(): void {
        this.tiers = [];
        this.isLoading = false;
        this.error = null;
    }
}

function mapTierDTOToTier(tierDTO: DTOTier): TonApiTier {
    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new TonCurrencyAmount(tierDTO.ton_price),
        description: {
            requestsPerSecondLimit: tierDTO.rpc,
            connections: {
                accountsLimit: tierDTO.burst,
                subscriptionsLimit: tierDTO.burst
            }
        }
    };
}

export const tonApiTiersStore = new TonApiTiersStore();
