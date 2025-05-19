import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    DTOTier,
    Loadable,
    DTOAppTier,
    createImmediateReaction,
    UsdCurrencyAmount,
    createAsyncAction
} from 'src/shared';
import { TonApiTier } from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { TonApiSelectedTier } from './interfaces';

export class TonApiTiersStore {
    tiers$ = new Loadable<TonApiTier[]>([]);

    selectedTier$ = new Loadable<TonApiSelectedTier | null>(null);

    constructor() {
        makeAutoObservable(this);

        this.fetchTiers();

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.selectedTier$.clear();

                if (project) {
                    this.fetchSelectedTier();
                }
            }
        );
    }

    get freeTier(): TonApiTier | undefined {
        return this.tiers$.value.find(tier => tier.price.amount.isZero());
    }

    fetchTiers = this.tiers$.createAsyncAction(async () => {
        const tiers = await apiClient.api.getTonApiTiers();
        return tiers.data.items.map(mapTierDTOToTier);
    });

    fetchSelectedTier = this.selectedTier$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectTonApiTier({
            project_id: projectsStore.selectedProject!.id
        });

        return mapAppTierDTOToSelectedTier(response.data.tier);
    });

    selectTier = this.selectedTier$.createAsyncAction(
        async (tierId: number) => {
            const result = await apiClient.api.updateProjectTonApiTier(
                { project_id: projectsStore.selectedProject!.id },
                {
                    tier_id: tierId
                }
            );

            return mapAppTierDTOToSelectedTier(result.data.tier);
        },
        {
            successToast: {
                title: 'Successful purchase'
            },
            errorToast: {
                title: 'Unsuccessful purchase'
            }
        }
    );

    checkValidChangeTier = createAsyncAction(async (tierId: number) => {
        if (!projectsStore.selectedProject) {
            throw new Error('Project is not selected');
        }

        const result = await apiClient.api.validChangeTonApiTier(tierId, {
            project_id: projectsStore.selectedProject.id
        });

        return result.data;
    });

    clearState(): void {
        this.tiers$.clear();
        this.selectedTier$.clear();
    }
}

function mapTierDTOToTier(tierDTO: DTOTier): TonApiTier {
    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new UsdCurrencyAmount(tierDTO.usd_price),
        description: {
            requestsPerSecondLimit: tierDTO.rpc,
            realtimeConnectionsLimit: tierDTO.long_polling_sub,
            entitiesPerRealtimeConnectionLimit: tierDTO.entity_per_conn,
            mempool: tierDTO.capabilities.includes('mempool')
        }
    };
}

function mapAppTierDTOToSelectedTier(tierDTO: DTOAppTier | null): TonApiSelectedTier | null {
    if (!tierDTO) {
        return null;
    }

    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new UsdCurrencyAmount(tierDTO.usd_price),
        description: {
            requestsPerSecondLimit: tierDTO.rpc,
            realtimeConnectionsLimit: tierDTO.long_polling_sub,
            entitiesPerRealtimeConnectionLimit: tierDTO.entity_per_conn,
            mempool: tierDTO.capabilities.includes('mempool')
        },
        subscriptionDate: new Date(tierDTO.date_create),
        renewsDate: tierDTO.next_payment ? new Date(tierDTO.next_payment) : undefined,
        active: true
    };
}
