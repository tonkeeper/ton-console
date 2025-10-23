import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    createImmediateReaction,
    DTOBillingTransaction,
    DTOBillingTransactionTypeEnum,
    DTOCryptoCurrency,
    Loadable,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { BillingHistory, BillingHistoryPaymentItem, BillingHistoryRefillItem } from './interfaces';
import { projectsStore, balanceStore } from 'src/shared/stores';

export class BillingStore {
    billingHistory$ = new Loadable<DTOBillingTransaction[]>([]);

    private pageSize = 20;

    get isResolved() {
        return this.billingHistory$.isResolved;
    }

    get totalItems() {
        return this.billingHistory$.value?.length || 0;
    }

    get tableContentLength(): number {
        return this.billingHistory.length;
    }

    get billingHistory(): BillingHistory {
        return (this.billingHistory$.value || []).map(dtoTx =>
            mapDTOTransactionToHistoryItem(dtoTx)
        );
    }

    get billingHistoryLoading(): boolean {
        return this.billingHistory$.isLoading;
    }

    get isPageLoading() {
        return this.loadNextPage.isLoading;
    }

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => balanceStore.currentBalance$,
            () => {
                this.fetchHistory();
            }
        );
    }

    fetchHistory = this.billingHistory$.createAsyncAction(
        async () => {
            const response = await apiClient.api.getProjectBillingHistory(
                projectsStore.selectedProject!.id,
                { limit: this.pageSize }
            );

            return response.data.history;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = createAsyncAction(async () => {
        const currentHistory = this.billingHistory$.value || [];
        if (currentHistory.length === 0) {
            return;
        }

        const lastTransaction = currentHistory[currentHistory.length - 1];
        const response = await apiClient.api.getProjectBillingHistory(
            projectsStore.selectedProject!.id,
            { limit: this.pageSize, before_tx: lastTransaction.id }
        );

        if (!response.data.history) {
            throw new Error('No history found');
        }

        this.billingHistory$.value = [...currentHistory, ...response.data.history];
    });

    isItemLoaded = (index: number): boolean => index < this.billingHistory.length;

    clearState(): void {
        this.billingHistory$.clear();
    }
}

function mapDTOTransactionToHistoryItem(
    dtoTx: DTOBillingTransaction
): BillingHistoryRefillItem | BillingHistoryPaymentItem {
    const date = new Date(dtoTx.created_at);
    const id = date.getTime();
    const amount = mapDTOCurrencyToAmount(dtoTx.currency, dtoTx.amount);

    if (dtoTx.type === DTOBillingTransactionTypeEnum.DTODeposit) {
        return {
            id,
            date,
            amount,
            type: 'deposit' as const,
            action: 'refill' as const
        };
    } else {
        return {
            id,
            date,
            amount,
            action: 'payment' as const,
            name: dtoTx.reason
        };
    }
}

function mapDTOCurrencyToAmount(currency: DTOCryptoCurrency, amount: string) {
    switch (currency) {
        case DTOCryptoCurrency.DTO_TON:
            return new TonCurrencyAmount(amount);
        case DTOCryptoCurrency.DTO_USDT:
            return new UsdCurrencyAmount(amount);
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
}
