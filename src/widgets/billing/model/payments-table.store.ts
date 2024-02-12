import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    DTOCharge,
    DTOServiceName,
    DTOStatsQueryType,
    Loadable,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { Payment } from './interfaces';
import { projectsStore } from 'src/entities';
import {
    AppMessagesPackage,
    appMessagesStore,
    faucetStore,
    TonApiTier,
    tonApiTiersStore
} from 'src/features';
import BigNumber from 'bignumber.js';

class PaymentsTableStore {
    charges$ = new Loadable<DTOCharge[]>([]);

    totalPayments = 0;

    pageSize = 30;

    get payments(): Payment[] {
        const tonapiTiers = tonApiTiersStore.tiers$.value;
        const appMessagesPackages = appMessagesStore.packages$.value;
        const tonRate = faucetStore.tonRate$.value;

        if (!tonapiTiers.length || !appMessagesPackages.length || !tonRate) {
            return [];
        }

        return this.charges$.value
            .map(charge => {
                switch (charge.service) {
                    case DTOServiceName.DTOTonapi:
                        return mapChargeToTonapiPayment(charge, tonapiTiers);
                    case DTOServiceName.DTOMessages:
                        return mapChargeToAppMessagesPayment(charge, appMessagesPackages);
                    case DTOServiceName.DTOTestnet:
                        return mapChargeToFaucetPayment(charge, tonRate);
                    case DTOServiceName.DTOStats:
                        return mapChargeToAnalyticsPayment(charge);
                    default:
                        return null;
                }
            })
            .filter(x => !!x) as Payment[];
    }

    get hasNextPage(): boolean {
        return this.payments.length < this.totalPayments;
    }

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject?.id,
            project => {
                this.clearState();
                this.loadFirstPage.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (project) {
                    this.loadFirstPage();
                }
            }
        );
    }

    isItemLoaded = (index: number): boolean => !this.hasNextPage || index < this.payments.length;

    loadFirstPage = this.charges$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();

            const response = await this.fetchPayments();

            this.totalPayments = response.count;
            return response.history;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.charges$.createAsyncAction(async () => {
        const response = await this.fetchPayments({ offset: this.charges$.value.length });

        this.totalPayments = response.count;
        return this.charges$.value.concat(response.history);
    });

    updateCurrentListSilently = this.charges$.createAsyncAction(async () => {
        const response = await this.fetchPayments();

        this.totalPayments = response.count;
        return response.history;
    });

    private async fetchPayments(options?: {
        offset?: number;
        pageSize?: number;
    }): Promise<{ count: number; history: DTOCharge[] }> {
        const result = await apiClient.api.projectPaymentsHistory(
            projectsStore.selectedProject!.id,
            {
                ...(options?.offset !== undefined && { offset: options.offset }),
                limit: options?.pageSize || this.pageSize
            }
        );
        return result.data;
    }

    clearState(): void {
        this.charges$.clear();
        this.totalPayments = 0;
    }
}

function mapChargeToTonapiPayment(charge: DTOCharge, tiers: TonApiTier[]): Payment | null {
    const tier = tiers.find(item => item.id === Number(charge.tier_id));
    if (!tier) {
        return null;
    }

    const tonAmount = new TonCurrencyAmount(charge.amount);

    return {
        id: `tonapi-${charge.id}`,
        name: `TonAPI ${tier.name}`,
        date: new Date(charge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(charge.exchange_rate)
        )
    };
}

function mapChargeToAppMessagesPayment(
    charge: DTOCharge,
    packages: AppMessagesPackage[]
): Payment | null {
    const boughtPackage = packages.find(item => item.id === charge.messages_package_id);

    if (!boughtPackage) {
        return null;
    }

    const tonAmount = new TonCurrencyAmount(charge.amount);

    return {
        id: `app messages-${charge.id}`,
        name: `Messages package ${boughtPackage.name}`,
        date: new Date(charge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(charge.exchange_rate)
        )
    };
}

function mapChargeToFaucetPayment(charge: DTOCharge, tonRate: number): Payment {
    const tonAmount = new TonCurrencyAmount(charge.amount);
    const boughtAmount = new TonCurrencyAmount(
        new BigNumber(charge.amount).multipliedBy(charge.testnet_price_multiplicator || tonRate)
    );

    return {
        id: `faucet-${charge.id}`,
        name: `Bought ${boughtAmount.stringAmount} testnet TON`,
        date: new Date(charge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(charge.exchange_rate)
        )
    };
}

function mapChargeToAnalyticsPayment(charge: DTOCharge): Payment {
    const subservices = {
        [DTOStatsQueryType.DTOGraph]: 'graph',
        [DTOStatsQueryType.DTOBaseQuery]: 'query',
        [DTOStatsQueryType.DTOChatGptQuery]: 'gpt generation'
    } as const;

    const tonAmount = new TonCurrencyAmount(charge.amount);

    return {
        id: `analytics-${charge.id}`,
        name: `TON Analytics ${subservices[charge.stats_type_query!]}`,
        date: new Date(charge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(charge.exchange_rate)
        )
    };
}

export const paymentsTableStore = new PaymentsTableStore();
