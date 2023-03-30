import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { createEffect, CurrencyAmount, getWindow, Loadable, TonCurrencyAmount } from 'src/shared';
import { projectsStore } from '../../project';
import { BillingHistory } from './interfaces';
import { SERVICE } from 'src/entities';

class BalancesStore {
    balances = new Loadable<CurrencyAmount[]>([]);

    depositAddress = new Loadable<string | undefined>(undefined);

    billingHistory = new Loadable<BillingHistory>([]);

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'BalancesStore',
            properties: ['balances'],
            storage: getWindow()!.localStorage
        }).then(() => {
            createEffect(() => {
                if (projectsStore.selectedProject) {
                    this.fetchDepositAddress();
                    this.fetchBalances();
                    this.fetchBillingHistory();
                } else {
                    this.clearState();
                }
            });
        });
    }

    fetchBalancesAndHistory(): void {
        this.fetchBalances();
        this.fetchBillingHistory();
    }

    fetchBalances = async (): Promise<void> => {
        this.balances.error = null;

        try {
            this.balances.isLoading = true;
            this.balances.value = [new TonCurrencyAmount(1000000000)];
        } catch (e) {
            console.error(e);
            this.balances.error = e;
        }
        this.balances.isLoading = false;
    };

    fetchDepositAddress = async (): Promise<void> => {
        this.depositAddress.error = null;

        try {
            this.depositAddress.isLoading = true;
            /*const response = await apiClient.project.getDepositAddress(
                projectsStore.selectedProject!.id
            );*/

            //this.depositAddress.value = response.data.ton_deposit_wallet;
            this.depositAddress.value = 'EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq';
        } catch (e) {
            console.error(e);
            this.depositAddress.error = e;
        }
        this.depositAddress.isLoading = false;
    };

    fetchBillingHistory = async (): Promise<void> => {
        this.billingHistory.error = null;

        try {
            this.billingHistory.isLoading = true;
            this.billingHistory.value = [
                {
                    action: 'payment',
                    amount: new TonCurrencyAmount(1000000000),
                    date: new Date(),
                    description: {
                        service: SERVICE.TONAPI,
                        tierId: 1
                    },
                    id: 0
                },
                {
                    action: 'refill',
                    amount: new TonCurrencyAmount(2000000000),
                    fromAddress: 'EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq',
                    date: new Date(),
                    id: 1
                }
            ];
        } catch (e) {
            console.error(e);
            this.billingHistory.error = e;
        }
        this.billingHistory.isLoading = false;
    };

    private clearState(): void {
        this.balances.clear();
        this.billingHistory.clear();
        this.depositAddress.clear();
    }
}

export const balanceStore = new BalancesStore();
