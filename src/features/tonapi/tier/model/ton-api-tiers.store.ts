import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    DTOTier,
    createEffect,
    TonCurrencyAmount,
    Loadable,
    DTOAppTier,
    DTOCharge,
    createAsyncAction
} from 'src/shared';
import { TonApiPayment, TonApiTier } from './interfaces';
import { projectsStore, tGUserStore } from 'src/entities';
import { TonApiSelectedTier } from './interfaces';
import { createStandaloneToast } from '@chakra-ui/react';

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
                this.fetchSelectedTier();
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
            const response = await apiClient.api.getTonApiProjectTier({
                project_id: projectsStore.selectedProject!.id
            });

            this.selectedTier.value = mapAppTierDTOToSelectedTier(response.data.tier);
        } catch (e) {
            console.error(e);
            this.selectedTier.error = e;
        }

        this.selectedTier.isLoading = false;
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

    selectTier = createAsyncAction(
        async (tierId: number) => {
            this.selectedTier.isLoading = true;
            const result = await apiClient.api.updateTonApiTier(
                { project_id: projectsStore.selectedProject!.id },
                {
                    tier_id: tierId
                }
            );

            this.selectedTier.value = mapAppTierDTOToSelectedTier(result.data.tier);
            this.selectedTier.isLoading = false;

            const { toast } = createStandaloneToast();
            toast({ title: 'Successful purchase', status: 'success', isClosable: true });
        },
        e => {
            console.error(e);
            this.selectedTier.isLoading = false;

            const { toast } = createStandaloneToast();
            toast({
                title: 'Unsuccessful purchase',
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    );

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
