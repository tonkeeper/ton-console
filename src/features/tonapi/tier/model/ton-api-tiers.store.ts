import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    DTOTier,
    createEffect,
    TonCurrencyAmount,
    Loadable,
    DTOAppTier,
    DTOCharge
} from 'src/shared';
import { TonApiPayment, TonApiTier } from './interfaces';
import { projectsStore, tGUserStore } from 'src/entities';
import { TonApiSelectedTier } from './interfaces';

class TonApiTiersStore {
    tiers = new Loadable<TonApiTier[]>([]);

    selectedTier = new Loadable<TonApiSelectedTier | null>(null);

    paymentsHistory = new Loadable<TonApiPayment[]>([]);

    constructor() {
        makeAutoObservable(this);

        createEffect(() => {
            if (tGUserStore.user) {
                this.fetchTiers();
            } else {
                this.clearState();
            }
        });

        createEffect(() => {
            if (projectsStore.selectedProject) {
                this.fetchTiers();
            } else {
                this.selectedTier.clear();
            }
        });

        createEffect(() => {
            if (this.tiers.value && projectsStore.selectedProject) {
                this.fetchPaymentsHistory();
            } else {
                this.paymentsHistory.clear();
            }
        });
    }

    fetchTiers = async (): Promise<void> => {
        this.tiers.isLoading = true;
        this.tiers.error = null;

        try {
            const tiers = await apiClient.api.getTonApiTiers();
            this.tiers.value = tiers.data.items.map(mapTierDTOToTier);
        } catch (e) {
            console.error(e);
            this.tiers.error = e;
        }

        this.tiers.isLoading = false;
    };

    fetchSelectedTier = async (): Promise<void> => {
        this.selectedTier.isLoading = true;

        try {
            const response = await apiClient.api.getTonApiTier({
                project_id: projectsStore.selectedProject!.id
            });

            this.selectedTier.value = mapAppTierDTOToSelectedTier(response.data.tier);
        } catch (e) {
            console.error(e);
            this.selectedTier.error = e;
        }

        this.selectedTier.isLoading = true;
    };

    fetchPaymentsHistory = async (): Promise<void> => {
        this.paymentsHistory.isLoading = true;

        try {
            const response = await apiClient.api.getTonApiPaymentsHistory({
                project_id: projectsStore.selectedProject!.id
            });

            this.paymentsHistory.value = response.data.history
                .map(payment => mapDTOPaymentToTonApiPayment(this.tiers.value, payment))
                .filter(i => !!i) as TonApiPayment[];
        } catch (e) {
            console.error(e);
            this.paymentsHistory.error = e;
        }

        this.paymentsHistory.isLoading = false;
    };

    clearState(): void {
        this.tiers.clear();
        this.selectedTier.clear();
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

function mapAppTierDTOToSelectedTier(tierDTO: DTOAppTier): TonApiSelectedTier {
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
        },
        subscriptionDate: new Date(tierDTO.date_create),
        active: true
    };
}

function mapDTOPaymentToTonApiPayment(
    tiers: TonApiTier[],
    payment: DTOCharge
): TonApiPayment | null {
    const tier = tiers.find(item => item.id === Number(payment.info));
    if (!tier) {
        return null;
    }

    return {
        id: Math.random().toString(), // TODO
        tier,
        date: new Date(payment.date_create),
        amount: new TonCurrencyAmount(payment.amount)
    };
}

export const tonApiTiersStore = new TonApiTiersStore();
