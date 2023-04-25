import { makeAutoObservable, untracked } from 'mobx';
import {
    apiClient,
    DTOTier,
    createEffect,
    TonCurrencyAmount,
    Loadable,
    DTOAppTier,
    DTOCharge,
    createImmediateReaction
} from 'src/shared';
import { TonApiPayment, TonApiTier } from './interfaces';
import { projectsStore, tGUserStore } from 'src/entities';
import { TonApiSelectedTier } from './interfaces';

class TonApiTiersStore {
    tiers$ = new Loadable<TonApiTier[]>([]);

    selectedTier$ = new Loadable<TonApiSelectedTier | null>(null);

    paymentsHistory$ = new Loadable<TonApiPayment[]>([]);

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => tGUserStore.user$.value,
            user => {
                this.clearState();

                if (user) {
                    this.fetchTiers();
                }
            }
        );

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.selectedTier$.clear();

                if (project) {
                    this.fetchSelectedTier();
                }
            }
        );

        createEffect(() => {
            if (this.tiers$.isResolved && projectsStore.selectedProjectId) {
                untracked(this.fetchPaymentsHistory);
            } else {
                this.paymentsHistory$.clear();
            }
        });
    }

    fetchTiers = this.tiers$.createAsyncAction(async () => {
        const tiers = await apiClient.api.getTonApiTiers();
        return tiers.data.items.map(mapTierDTOToTier);
    });

    fetchSelectedTier = this.selectedTier$.createAsyncAction(async () => {
        const response = await apiClient.api.getTonApiProjectTier({
            project_id: projectsStore.selectedProject!.id
        });

        return mapAppTierDTOToSelectedTier(response.data.tier);
    });

    fetchPaymentsHistory = this.paymentsHistory$.createAsyncAction(async () => {
        const response = await apiClient.api.getTonApiPaymentsHistory({
            project_id: projectsStore.selectedProject!.id
        });

        return response.data.history
            .map(payment => mapDTOPaymentToTonApiPayment(this.tiers$.value, payment))
            .filter(i => !!i) as TonApiPayment[];
    });

    selectTier = this.selectedTier$.createAsyncAction(
        async (tierId: number) => {
            const result = await apiClient.api.updateTonApiTier(
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

    clearState(): void {
        this.tiers$.clear();
        this.selectedTier$.clear();
        this.paymentsHistory$.clear();
    }
}

function mapTierDTOToTier(tierDTO: DTOTier): TonApiTier {
    return {
        id: tierDTO.id,
        name: tierDTO.name,
        price: new TonCurrencyAmount(tierDTO.ton_price),
        description: {
            requestsPerSecondLimit: tierDTO.rpc
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
        price: new TonCurrencyAmount(tierDTO.ton_price),
        description: {
            requestsPerSecondLimit: tierDTO.rpc
        },
        subscriptionDate: new Date(tierDTO.date_create),
        renewsDate: new Date(tierDTO.next_payment),
        active: true
    };
}

function mapDTOPaymentToTonApiPayment(
    tiers: TonApiTier[],
    payment: DTOCharge
): TonApiPayment | null {
    const tier = tiers.find(item => item.id === Number(payment.tier_id));
    if (!tier) {
        return null;
    }

    return {
        id: payment.id,
        tier,
        date: new Date(payment.date_create),
        amount: new TonCurrencyAmount(payment.amount)
    };
}

export const tonApiTiersStore = new TonApiTiersStore();
