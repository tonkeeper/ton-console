import { makeAutoObservable } from 'mobx';
import {
    Loadable,
    createImmediateReaction,
    UsdCurrencyAmount,
    createAsyncAction
} from 'src/shared';
import {
    DTOTier,
    DTOAppTier,
    getTonApiTiers,
    getProjectTonApiTier,
    updateProjectTonApiTier,
    validChangeTonApiTier
} from 'src/shared/api';
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
        const { data, error } = await getTonApiTiers();
        if (error) throw error;

        return data.items.map(mapTierToRestApiTier);
    });

    fetchSelectedTier = this.selectedTier$.createAsyncAction(async () => {
        const { data, error } = await getProjectTonApiTier({
            query: { project_id: projectsStore.selectedProject!.id }
        });
        if (error) throw error;

        return mapAppTierToSelectedTier(data.tier);
    });

    selectTier = this.selectedTier$.createAsyncAction(
        async (tierId: number) => {
            const { data, error } = await updateProjectTonApiTier({
                query: { project_id: projectsStore.selectedProject!.id },
                body: { tier_id: tierId }
            });
            if (error) throw error;

            return mapAppTierToSelectedTier(data.tier);
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

        const { data, error } = await validChangeTonApiTier({
            path: { id: tierId },
            query: { project_id: projectsStore.selectedProject.id }
        });

        if (error) throw error;

        return data;
    });

    clearState(): void {
        this.tiers$.clear();
        this.selectedTier$.clear();
    }
}

function mapTierToRestApiTier(tier: DTOTier): RestApiTier {
    return {
        id: tier.id,
        name: tier.name,
        price: new UsdCurrencyAmount(tier.usd_price),
        rps: tier.rpc,
        type: tier.instant_payment ? 'pay-as-you-go' : 'monthly'
    };
}

function mapAppTierToSelectedTier(tier: DTOAppTier | null): RestApiSelectedTier | null {
    if (!tier) {
        return null;
    }

    const nextPayment = tier.next_payment;
    const usdPrice = tier.usd_price;
    const renewsDate = nextPayment && usdPrice ? new Date(nextPayment) : undefined;

    return {
        id: tier.id,
        name: tier.name,
        price: new UsdCurrencyAmount(usdPrice),
        rps: tier.rpc,
        type: tier.instant_payment ? 'pay-as-you-go' : 'monthly',
        renewsDate,
        active: true
    };
}
