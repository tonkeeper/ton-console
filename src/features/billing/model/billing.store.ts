import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    createImmediateReaction,
    CRYPTO_CURRENCY,
    DTOBillingTransaction,
    DTOBillingTransactionTypeEnum,
    DTOCryptoCurrency,
    Loadable,
    TokenCurrencyAmount,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { projectsStore, balanceStore } from 'src/shared/stores';

export type BillingHistoryItem = {
    id: string;
    date: Date;
    amount: TonCurrencyAmount | UsdCurrencyAmount;
    type: DTOBillingTransactionTypeEnum;
    reason: string;
};

export class BillingStore {
    billingHistory$ = new Loadable<DTOBillingTransaction[]>([]);

    private pageSize = 20;

    private disposers: Array<() => void> = [];

    private lastProjectId: number | null = null;

    get isResolved() {
        return this.billingHistory$.isResolved;
    }

    get totalItems() {
        return this.billingHistory$.value?.length || 0;
    }

    get tableContentLength(): number {
        return this.billingHistory.length;
    }

    get billingHistory(): BillingHistoryItem[] {
        return (this.billingHistory$.value || []).map(dtoTx =>
            mapDTOTransactionToBillingHistoryItem(dtoTx)
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

        const dispose1 = createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();
                if (project) {
                    this.fetchHistory();
                }
            }
        );
        this.disposers.push(dispose1);

        const dispose2 = createImmediateReaction(
            () => balanceStore.balance?.total,
            total => {
                if (total !== undefined && projectsStore.selectedProject) {
                    this.fetchHistory();
                }
            }
        );
        this.disposers.push(dispose2);
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

    ensureDataLoaded(): void {
        const currentProjectId = projectsStore.selectedProject?.id || null;

        // Reload if project changed or data not resolved
        if (
            currentProjectId !== this.lastProjectId ||
            !this.billingHistory$.isResolved
        ) {
            this.lastProjectId = currentProjectId;

            if (currentProjectId) {
                this.clearState();
                this.fetchHistory();
            }
        }
    }

    clearState(): void {
        this.billingHistory$.clear();
    }

    destroy(): void {
        this.disposers.forEach(dispose => dispose?.());
        this.disposers = [];
    }
}

function mapDTOTransactionToBillingHistoryItem(dtoTx: DTOBillingTransaction): BillingHistoryItem {
    const date = new Date(dtoTx.created_at * 1000);
    const amount = mapDTOCurrencyToAmount(dtoTx.currency, dtoTx.amount);

    return {
        id: dtoTx.id,
        date,
        amount,
        type: dtoTx.type,
        reason: dtoTx.info.reason
        // meta: dtoTx.info.meta,
    };
}

function mapDTOCurrencyToAmount(currency: DTOCryptoCurrency, amount: string) {
    switch (currency) {
        case DTOCryptoCurrency.DTO_TON:
            return new TonCurrencyAmount(amount);
        case DTOCryptoCurrency.DTO_USDT:
            return new TokenCurrencyAmount({
                weiAmount: amount,
                currency: CRYPTO_CURRENCY.USDT,
                decimals: 6
            });
        default:
            throw new Error(`Unknown currency: ${currency}`);
    }
}
