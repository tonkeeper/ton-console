import { makeAutoObservable } from 'mobx';
import { createAsyncAction } from 'src/shared';
import { BillingHistory, BillingHistoryPaymentItem, BillingHistoryRefillItem } from './interfaces';
import { balancesStore } from 'src/shared/stores';
import { paymentsTableStore } from './payments-table.store';

class BillingStore {
    get isResolved() {
        return balancesStore.portfolio$.isResolved && paymentsTableStore.charges$.isResolved;
    }

    get totalItems() {
        return balancesStore.refills.length + paymentsTableStore.totalPayments;
    }

    get tableContentLength(): number {
        return paymentsTableStore.hasNextPage
            ? this.billingHistory.length + 1
            : this.billingHistory.length;
    }

    get billingHistory(): BillingHistory {
        const refills: BillingHistoryRefillItem[] = balancesStore.refills.map(item => ({
            ...item,
            action: 'refill'
        }));
        const payments: BillingHistoryPaymentItem[] = paymentsTableStore.payments.map(item => ({
            ...item,
            action: 'payment'
        }));
        const history = [...refills, ...payments].sort((a, b) => (a.date < b.date ? 1 : -1));
        if (payments.length !== paymentsTableStore.totalPayments) {
            let lastPaymentIndex = 0;
            history.forEach((item, index) => {
                if (item.action === 'payment') {
                    lastPaymentIndex = index;
                }
            });

            return history.slice(0, lastPaymentIndex + 1);
        }

        return history;
    }

    get billingHistoryLoading(): boolean {
        return paymentsTableStore.charges$.isLoading || balancesStore.portfolio$.isLoading;
    }

    get isPageLoading() {
        return this.loadFirstPage.isLoading || this.loadNextPage.isLoading;
    }

    constructor() {
        makeAutoObservable(this);
    }

    loadFirstPage = createAsyncAction(async () => {
        paymentsTableStore.loadFirstPage.cancelAllPendingCalls();

        await Promise.all([balancesStore.fetchPortfolio(), paymentsTableStore.loadFirstPage()]);
    });

    loadNextPage = createAsyncAction(async () => {
        paymentsTableStore.loadNextPage.cancelAllPendingCalls();
        await paymentsTableStore.loadNextPage();
    });

    updateCurrentListSilently = createAsyncAction(async () => {
        paymentsTableStore.updateCurrentListSilently.cancelAllPendingCalls();
        await Promise.all([
            balancesStore.fetchPortfolio(),
            paymentsTableStore.updateCurrentListSilently()
        ]);
    });

    isItemLoaded = (index: number): boolean =>
        !paymentsTableStore.hasNextPage || index < this.billingHistory.length;

    clear() {
        paymentsTableStore.clearState();
    }
}

export const billingStore = new BillingStore();
