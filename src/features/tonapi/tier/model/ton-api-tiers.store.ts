import { makeAutoObservable, untracked } from 'mobx';
import {
    apiClient,
    DTOTier,
    createEffect,
    TonCurrencyAmount,
    Loadable,
    DTOAppTier,
    DTOCharge,
    createImmediateReaction,
    UsdCurrencyAmount,
    createAsyncAction
} from 'src/shared';
import { TonApiPayment, TonApiTier } from './interfaces';
import { projectsStore } from 'src/entities';
import { TonApiSelectedTier } from './interfaces';

class TonApiTiersStore {
    tiers$ = new Loadable<TonApiTier[]>([]);

    selectedTier$ = new Loadable<TonApiSelectedTier | null>(null);

    paymentsHistory$ = new Loadable<TonApiPayment[]>([]);

    constructor() {
        makeAutoObservable(this);

        this.fetchTiers();

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.selectedTier$.clear();
                this.paymentsHistory$.clear();

                if (project) {
                    this.fetchSelectedTier();
                }
            }
        );

        createEffect(() => {
            if (this.tiers$.isResolved && projectsStore.selectedProject?.id) {
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

    checkCanBuyTier = createAsyncAction(async (tierId: number) => {
        try {
            const result = await apiClient.api.checkValidBuyTonApiTier(tierId, {
                project_id: projectsStore.selectedProject!.id
            });

            return result.data.valid;
        } catch (e) {
            console.error(e);
            return false;
        }
    });

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

function mapDTOPaymentToTonApiPayment(
    tiers: TonApiTier[],
    payment: DTOCharge
): TonApiPayment | null {
    const tier = tiers.find(item => item.id === Number(payment.tier_id));
    if (!tier) {
        return null;
    }

    const tonAmount = new TonCurrencyAmount(payment.amount);

    return {
        id: payment.id,
        tier,
        date: new Date(payment.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(payment.exchange_rate)
        )
    };
}

export const tonApiTiersStore = new TonApiTiersStore();
