import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    CurrencyAmount,
    DTODeposit,
    Loadable,
    setIntervalWhenPageOnFocus,
    TonCurrencyAmount
} from 'src/shared';
import { projectsStore } from '../../project';
import { Portfolio, Refill } from './interfaces';

class BalancesStore {
    portfolio$ = new Loadable<Portfolio | null>(null);

    depositAddress$ = new Loadable<string | undefined>(undefined);

    get balances(): CurrencyAmount[] {
        return this.portfolio$.value?.balances || [];
    }

    get refills(): Refill[] {
        return this.portfolio$.value?.refills || [];
    }

    constructor() {
        makeAutoObservable(this);

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                if (project) {
                    this.fetchDepositAddress();
                    this.fetchPortfolio();
                } else {
                    this.clearState();
                }
            }
        );

        setIntervalWhenPageOnFocus(() => {
            if (projectsStore.selectedProject) {
                this.fetchPortfolio({ silently: true });
            }
        }, 3000);
    }

    fetchPortfolio = this.portfolio$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectDepositsHistory(
            projectsStore.selectedProject!.id
        );

        return {
            balances: [new TonCurrencyAmount(response.data.balance.balance)],
            refills: response.data.history.map(mapDTODepositToRefill)
        };
    });

    fetchDepositAddress = this.depositAddress$.createAsyncAction(async () => {
        const response = await apiClient.api.getDepositAddress(projectsStore.selectedProject!.id);

        return response.data.ton_deposit_wallet;
    });

    clearState = (): void => {
        this.portfolio$.clear();
        this.depositAddress$.clear();
    };
}

function mapDTODepositToRefill(dtoDeposit: DTODeposit): Refill {
    return {
        id: new Date(dtoDeposit.income_date).getTime(),
        date: new Date(dtoDeposit.income_date),
        amount: new TonCurrencyAmount(dtoDeposit.amount),
        fromAddress: dtoDeposit.source_address
    };
}

export const balanceStore = new BalancesStore();
