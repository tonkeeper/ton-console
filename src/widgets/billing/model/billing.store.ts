import { makeAutoObservable } from 'mobx';
import { createAsyncAction } from 'src/shared';
import { TonApiPayment, tonApiTiersStore } from 'src/features';
import {
    BillingHistory,
    BillingHistoryPaymentItem,
    BillingHistoryRefillItem,
    Payment
} from './interfaces';
import { balanceStore } from 'src/entities';

class BillingStore {
    get billingHistory(): BillingHistory {
        const refills: BillingHistoryRefillItem[] = balanceStore.refills.value.map(item => ({
            ...item,
            action: 'refill'
        }));
        const payments: BillingHistoryPaymentItem[] = this.paymentsHistory.map(item => ({
            ...item,
            action: 'payment'
        }));
        return [...refills, ...payments].sort((a, b) => (a.date < b.date ? 1 : -1));
    }

    get billingHistoryLoading(): boolean {
        return this.paymentsHistoryLoading || balanceStore.refills.isLoading;
    }

    private get paymentsHistory(): Payment[] {
        return tonApiTiersStore.paymentsHistory.value.map(mapTonapiPaymentToPayment);
    }

    private get paymentsHistoryLoading(): boolean {
        return tonApiTiersStore.paymentsHistory.isLoading;
    }

    constructor() {
        makeAutoObservable(this);
    }

    fetchBillingHistory = createAsyncAction(async () => {
        await Promise.all([
            balanceStore.fetchBalancesAndRefills(),
            tonApiTiersStore.fetchPaymentsHistory()
        ]);
    });
}

function mapTonapiPaymentToPayment(payment: TonApiPayment): Payment {
    return {
        id: `tonapi-${payment.id}`,
        name: `TON API «${payment.tier.name}»`,
        date: payment.date,
        amount: payment.amount
    };
}

export const billingStore = new BillingStore();
