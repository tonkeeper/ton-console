import { makeAutoObservable } from 'mobx';
import {
    createAsyncAction,
    createImmediateReaction,
    Loadable,
    setIntervalWhenPageOnFocus,
    tonapiMainnet,
    toDecimals
} from 'src/shared';
import {
    DTOBalance,
    getProjectBillingHistory,
    getDepositAddress,
    promoCodeDepositProject
} from 'src/shared/api';
import { ProjectsStore } from '../project/model/projects.store';
import { createStandaloneToast } from '@chakra-ui/react';

const USDT_DECIMALS = 6;
const TON_DECIMALS = 9;

export type Balance = {
    total: number;
    usdt: {
        amount: bigint;
        promo_amount: bigint;
    };
    ton?: {
        amount: bigint;
        promo_amount: bigint;
    };
};

export type RefillAddresses = {
    usdt_deposit_wallet: string;
    ton_deposit_wallet?: string;
};

export class BalanceStore {
    currentBalance$ = new Loadable<Balance | undefined>(undefined);

    depositAddress$ = new Loadable<RefillAddresses | undefined>(undefined);

    tonRate$ = new Loadable<number | undefined>(undefined);

    private readonly projectsStore: ProjectsStore;

    get balance(): Balance | undefined {
        return this.currentBalance$.value;
    }

    constructor(projectsStore: ProjectsStore) {
        makeAutoObservable(this);
        this.projectsStore = projectsStore;
        this.fetchTonRate();
        this.fetchDepositAddress();

        createImmediateReaction(
            () => this.projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchDepositAddress();
                    this.fetchBalance();
                }
            }
        );

        setIntervalWhenPageOnFocus(() => {
            if (this.projectsStore.selectedProject) {
                this.fetchBalance({ silently: true });
            }
        }, 3000);
    }

    private convertBalanceToDecimal(balance: DTOBalance, decimals: number): number {
        const total = BigInt(balance.amount) + BigInt(balance.promo_amount);
        return Number(toDecimals(total, decimals));
    }

    private async ensureTonRateLoaded(): Promise<number> {
        if (this.tonRate$.value === undefined) {
            await this.fetchTonRate();
        }
        if (!this.tonRate$.value) {
            throw new Error('Ton rate not loaded');
        }

        return this.tonRate$.value!;
    }

    private async calculateTotal(
        usdtBalance: DTOBalance,
        tonBalance?: DTOBalance
    ): Promise<number> {
        const totalUsdt = this.convertBalanceToDecimal(usdtBalance, USDT_DECIMALS);

        if (!tonBalance) {
            return totalUsdt;
        }

        const tonRate = await this.ensureTonRateLoaded();
        const totalTon = this.convertBalanceToDecimal(tonBalance, TON_DECIMALS);
        const total = totalUsdt + totalTon * tonRate;
        return total;
    }

    fetchBalance = this.currentBalance$.createAsyncAction(async (): Promise<Balance> => {
        const { data, error } = await getProjectBillingHistory({
            path: {
                id: this.projectsStore.selectedProject!.id
            },
            query: {
                limit: 0
            }
        });

        if (error) throw error

        const { usdt_balance, ton_balance } = data;
        const total = await this.calculateTotal(usdt_balance, ton_balance);

        return {
            total: total,
            usdt: {
                amount: BigInt(usdt_balance.amount),
                promo_amount: BigInt(usdt_balance.promo_amount)
            },
            ...(ton_balance && {
                ton: {
                    amount: BigInt(ton_balance.amount),
                    promo_amount: BigInt(ton_balance.promo_amount)
                }
            })
        };
    });

    fetchTonRate = this.tonRate$.createAsyncAction(
        (): Promise<number | undefined> =>
            tonapiMainnet.rates
                .getRates({ tokens: ['ton'], currencies: ['usd'] })
                .then(data => data.rates.TON.prices?.USD)
    );

    fetchDepositAddress = this.depositAddress$.createAsyncAction(
        async (): Promise<RefillAddresses> => {
            const projectId = this.projectsStore.selectedProject!.id;
            const { data, error } = await getDepositAddress({
                path: { id: projectId }
            });

            if (error) throw error

            return data;
        }
    );

    applyPromoCode = createAsyncAction(async (promoCode: string) => {
        const { toast } = createStandaloneToast();

        try {
            const projectId = this.projectsStore.selectedProject!.id;
            const { error } = await promoCodeDepositProject({
                path: { id: projectId, promo_code: promoCode }
            });

            if (error) throw error

            await this.fetchBalance();
            toast({
                title: 'Promo code succesfully used',
                status: 'success',
                isClosable: true,
                duration: 2000
            });
            return true;
        } catch (_e) {
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
        this.currentBalance$.clear();
        this.depositAddress$.clear();
    };
}
