import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createEffect,
    CurrencyAmount,
    deserializeLoadableState,
    DTODeposit,
    getWindow,
    Loadable,
    serializeLoadableState,
    subscribeToVisibilitychange,
    TonCurrencyAmount
} from 'src/shared';
import { projectsStore } from '../../project';
import { Refill } from './interfaces';
import { makePersistable } from 'mobx-persist-store';

class BalancesStore {
    balances = new Loadable<CurrencyAmount[]>([]);

    depositAddress = new Loadable<string | undefined>(undefined);

    refills = new Loadable<Refill[]>([]);

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'BalancesStore',
            properties: [
                {
                    key: 'balances',
                    serialize: serializeLoadableState,
                    deserialize: deserializeLoadableState
                },
                {
                    key: 'refills',
                    serialize: serializeLoadableState,
                    deserialize: deserializeLoadableState
                }
            ],
            storage: getWindow()!.localStorage
        }).then(() =>
            createEffect(() => {
                if (projectsStore.selectedProject) {
                    this.fetchDepositAddress();
                    this.fetchBalancesAndRefills();
                } else {
                    this.clearState();
                }
            })
        );

        let interval: ReturnType<typeof setInterval>;
        subscribeToVisibilitychange(
            () =>
                (interval = setInterval(() => {
                    if (projectsStore.selectedProject) {
                        this.fetchBalancesAndRefills(true);
                    }
                }, 3000)),
            () => clearInterval(interval)
        );
    }

    fetchBalancesAndRefills = async (silently?: boolean): Promise<void> => {
        this.refills.error = null;
        this.balances.error = null;

        try {
            if (!silently) {
                this.refills.isLoading = true;
                this.balances.isLoading = true;
            }

            const response = await apiClient.api.getProjectDepositsHistory(
                projectsStore.selectedProject!.id
            );

            this.refills.value = response.data.history.map(mapDTODepositToRefill);
            this.balances.value = [new TonCurrencyAmount(response.data.balance!.balance)];
        } catch (e) {
            console.error(e);
            if (!silently) {
                this.refills.error = e;
                this.balances.error = e;
            }
        }

        if (!silently) {
            this.refills.isLoading = false;
            this.balances.isLoading = false;
        }
    };

    fetchDepositAddress = async (): Promise<void> => {
        this.depositAddress.error = null;

        try {
            this.depositAddress.isLoading = true;
            const response = await apiClient.api.getDepositAddress(
                projectsStore.selectedProject!.id
            );

            this.depositAddress.value = response.data.ton_deposit_wallet;
        } catch (e) {
            console.error(e);
            this.depositAddress.error = e;
        }
        this.depositAddress.isLoading = false;
    };

    private clearState(): void {
        this.balances.clear();
        this.refills.clear();
        this.depositAddress.clear();
    }
}

function mapDTODepositToRefill(dtoDeposit: DTODeposit): Refill {
    return {
        id: Math.random(), // TODO
        date: new Date(dtoDeposit.date_create || Date.now()), // TODO
        amount: new TonCurrencyAmount(dtoDeposit.balance),
        fromAddress: dtoDeposit.address
    };
}

export const balanceStore = new BalancesStore();
