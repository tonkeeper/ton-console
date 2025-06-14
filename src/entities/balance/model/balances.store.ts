import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createAsyncAction,
    createImmediateReaction,
    CurrencyAmount,
    DTODeposit,
    DTODepositTypeEnum,
    Loadable,
    setIntervalWhenPageOnFocus,
    TonAddress,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { ProjectsStore } from '../../project/model/projects.store';
import { Portfolio, Refill } from './interfaces';
import { ratesStore } from 'src/entities';
import { createStandaloneToast } from '@chakra-ui/react';

export class BalancesStore {
    portfolio$ = new Loadable<Portfolio | null>(null);

    depositAddress$ = new Loadable<string | undefined>(undefined);

    private readonly projectsStore: ProjectsStore;

    get balances(): CurrencyAmount[] {
        return this.portfolio$.value?.balances || [];
    }

    get refills(): Refill[] {
        return this.portfolio$.value?.refills || [];
    }

    get tonBalance(): TonCurrencyAmount | null {
        return (this.portfolio$.value?.balances[0] as TonCurrencyAmount) || null;
    }

    get tonBalanceUSDEquivalent(): UsdCurrencyAmount | null {
        if (ratesStore.rates$.TON.isResolved && this.tonBalance) {
            return new UsdCurrencyAmount(
                ratesStore.rates$.TON.value.multipliedBy(this.tonBalance.amount)
            );
        }

        return null;
    }

    constructor(projectsStore: ProjectsStore) {
        makeAutoObservable(this);
        this.projectsStore = projectsStore;

        createImmediateReaction(
            () => this.projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchDepositAddress();
                    this.fetchPortfolio();
                }
            }
        );

        setIntervalWhenPageOnFocus(() => {
            if (this.projectsStore.selectedProject) {
                this.fetchPortfolio({ silently: true });
            }
        }, 3000);
    }

    fetchPortfolio = this.portfolio$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectDepositsHistory(
            this.projectsStore.selectedProject!.id
        );

        return {
            balances: [new TonCurrencyAmount(response.data.balance.balance)],
            refills: response.data.history.map(mapDTODepositToRefill)
        };
    });

    fetchDepositAddress = this.depositAddress$.createAsyncAction(async () => {
        const response = await apiClient.api.getDepositAddress(
            this.projectsStore.selectedProject!.id
        );

        return response.data.ton_deposit_wallet;
    });

    applyPromoCode = createAsyncAction(async (promoCode: string) => {
        const { toast } = createStandaloneToast();

        try {
            await apiClient.api.promoCodeDepositProject(
                this.projectsStore.selectedProject!.id,
                promoCode
            );
            await this.fetchPortfolio();
            toast({
                title: 'Promo code succesfully used',
                status: 'success',
                isClosable: true,
                duration: 2000
            });
            return true;
        } catch (e) {
            toast({
                title: 'Invalid Promo Code',
                status: 'error',
                isClosable: true,
                duration: 2000
            });

            return false;
        }
    });

    clearState = (): void => {
        this.portfolio$.clear();
        this.depositAddress$.clear();
    };
}

function mapDTODepositToRefill(dtoDeposit: DTODeposit): Refill {
    const commonFields = {
        id: new Date(dtoDeposit.income_date).getTime(),
        date: new Date(dtoDeposit.income_date),
        amount: new TonCurrencyAmount(dtoDeposit.amount)
    };

    if (dtoDeposit.type === DTODepositTypeEnum.DTODeposit) {
        return {
            ...commonFields,
            type: 'deposit',
            fromAddress: TonAddress.parse(dtoDeposit.source_address!)
        };
    }

    return {
        ...commonFields,
        type: 'promoCode'
    };
}
