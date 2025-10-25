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
import { RestApiTier } from './interfaces';
import { projectsStore } from 'src/shared/stores';
import { RestApiSelectedTier } from './interfaces';

export class RestApiTiersStore {
    tiers$ = new Loadable<RestApiTier[]>([]);

    selectedTier$ = new Loadable<RestApiSelectedTier | null>(null);

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

    checkValidChangeTier = createAsyncAction((tierId: number) => {
        if (!projectsStore.selectedProject) {
            throw new Error('Project is not selected');
        }

        return apiClient.api
            .validChangeTonApiTier(tierId, {
                project_id: projectsStore.selectedProject.id
            })
            .then(result => result.data);
    });

    clearState(): void {
        this.tiers$.clear();
        this.selectedTier$.clear();
    }
}

function mapTierDTOToTier(tierDTO: DTOTier): RestApiTier {
    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new UsdCurrencyAmount(tierDTO.usd_price),
        rps: tierDTO.rpc,
        type: tierDTO.instant_payment ? 'pay-as-you-go' : 'monthly'
    };
}

function mapAppTierDTOToSelectedTier(tierDTO: DTOAppTier | null): RestApiSelectedTier | null {
    if (!tierDTO) {
        return null;
    }

    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new UsdCurrencyAmount(tierDTO.usd_price),
        rps: tierDTO.rpc,
        type: tierDTO.instant_payment ? 'pay-as-you-go' : 'monthly',
        renewsDate:
            tierDTO.next_payment && tierDTO.usd_price ? new Date(tierDTO.next_payment) : undefined,
        active: true
    };
}
