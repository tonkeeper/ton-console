import { makeAutoObservable } from 'mobx';
import { createAsyncAction } from 'src/shared';
import { FaucetPayment, faucetStore, TonApiPayment, tonApiTiersStore } from 'src/features';
import {
    BillingHistory,
    BillingHistoryPaymentItem,
    BillingHistoryRefillItem,
    Payment
} from './interfaces';
import { balanceStore } from 'src/entities';

class BillingStore {
    get billingHistory(): BillingHistory {
        const refills: BillingHistoryRefillItem[] = balanceStore.refills.map(item => ({
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
        return this.paymentsHistoryLoading || balanceStore.portfolio$.isLoading;
    }

    private get paymentsHistory(): Payment[] {
        return tonApiTiersStore.paymentsHistory$.value
            .map(mapTonapiPaymentToPayment)
            .concat(faucetStore.paymentsHistory$.value.map(mapFaucetPaymentToPayment));
    }

    private get paymentsHistoryLoading(): boolean {
        return (
            tonApiTiersStore.paymentsHistory$.isLoading || faucetStore.paymentsHistory$.isLoading
        );
    }

    constructor() {
        makeAutoObservable(this);
    }

    fetchBillingHistory = createAsyncAction(async () => {
        await Promise.all([
            balanceStore.fetchPortfolio(),
            tonApiTiersStore.fetchPaymentsHistory(),
            faucetStore.fetchPaymentsHistory()
        ]);
    });
}

function mapTonapiPaymentToPayment(payment: TonApiPayment): Payment {
    return {
        id: `tonapi-${payment.id}`,
        name: `TON API «${payment.tier.name}»`,
        date: payment.date,
        amount: payment.amount,
        amountUsdEquivalent: payment.amountUsdEquivalent
    };
}

function mapFaucetPaymentToPayment(payment: FaucetPayment): Payment {
    return {
        id: `faucet-${payment.id}`,
        name: `Bought ${payment.boughtAmount.stringAmount} testnet TON`,
        date: payment.date,
        amount: payment.amount,
        amountUsdEquivalent: payment.amountUsdEquivalent
    };
}

export const billingStore = new BillingStore();
