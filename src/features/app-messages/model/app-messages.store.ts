import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    awaitValueResolved,
    createImmediateReaction,
    DTOCharge,
    DTOMessagesPackage,
    Loadable,
    notNull,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { dappStore, projectsStore } from 'src/entities';
import { AppMessagesPackage, AppMessagesPayment, AppMessagesStats } from './interfaces';

class AppMessagesStore {
    packages$ = new Loadable<AppMessagesPackage[]>([]);

    balance$ = new Loadable<number>(0);

    stats$ = new Loadable<AppMessagesStats | null>(null);

    paymentsHistory$ = new Loadable<AppMessagesPayment[]>([]);

    dappToken$ = new Loadable<string | null>(null);

    constructor() {
        makeAutoObservable(this);

        this.fetchPackages();

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchBalance();
                    this.fetchPaymentsHistory();
                }
            }
        );

        createImmediateReaction(
            () => dappStore.dapps$.value,
            dapps => {
                this.clearDappRelatedState();

                if (dapps && dapps[0]) {
                    this.fetchStats();
                    this.fetchDappToken();
                }
            }
        );
    }

    fetchPackages = this.packages$.createAsyncAction(async () => {
        const result = await apiClient.api.getMessagesPackages();
        return result.data.items.map(mapDTOPackageToAppmessagesPackage);
    });

    fetchBalance = this.balance$.createAsyncAction(async () => {
        const result = await apiClient.api.getProjectMessagesBalance({
            project_id: projectsStore.selectedProject!.id
        });

        return result.data.balance;
    });

    fetchStats = this.stats$.createAsyncAction(async () => {
        const result = await apiClient.api.getProjectMessagesStats({
            app_id: dappStore.dapps$.value[0].id
        });

        return {
            totalUsers: result.data.stats.users,
            usersWithEnabledNotifications: result.data.stats.enable_notifications,
            sentNotificationsLastWeek: result.data.stats.sent_in_week
        };
    });

    buyPackage = this.balance$.createAsyncAction(
        async (packageId: AppMessagesPackage['id']) => {
            await apiClient.api.buyMessagesPackage(
                { project_id: projectsStore.selectedProject!.id },
                { id: packageId }
            );

            await this.fetchBalance();
        },
        {
            successToast: {
                title: 'Successful purchase'
            },
            errorToast: {
                title: 'Unsuccessful purchase'
            }
        }
    );

    fetchPaymentsHistory = this.paymentsHistory$.createAsyncAction(async () => {
        const packages = await awaitValueResolved(this.packages$);
        const history = await apiClient.api.getProjectMessagesPaymentsHistory({
            project_id: projectsStore.selectedProject!.id
        });

        return history.data.history
            .map(item => mapDTOChargeToAppmessagesPayment(packages, item))
            .filter(notNull);
    });

    fetchDappToken = this.dappToken$.createAsyncAction(async () => {
        const response = await apiClient.api.getProjectMessagesAppToken({
            app_id: dappStore.dapps$.value[0].id
        });

        return response.data.token;
    });

    regenerateDappToken = this.dappToken$.createAsyncAction(
        async () => {
            const response = await apiClient.api.regenerateProjectMessagesAppToken({
                app_id: dappStore.dapps$.value[0].id
            });

            return response.data.token;
        },
        {
            successToast: {
                title: 'Token regenerated successfully'
            },
            errorToast: {
                title: 'Token regeneration error'
            }
        }
    );

    clearState = (): void => {
        this.paymentsHistory$.clear();
        this.balance$.clear();
    };

    clearDappRelatedState = (): void => {
        this.dappToken$.clear();
        this.stats$.clear();
    };
}

function mapDTOPackageToAppmessagesPackage(dtoPackage: DTOMessagesPackage): AppMessagesPackage {
    return {
        messagesIncluded: dtoPackage.limits,
        price: new UsdCurrencyAmount(dtoPackage.usd_price),
        name: dtoPackage.name,
        id: dtoPackage.id
    };
}

function mapDTOChargeToAppmessagesPayment(
    packages: AppMessagesPackage[],
    dtoCharge: DTOCharge
): AppMessagesPayment | null {
    const boughtPackage = packages.find(item => item.id === dtoCharge.messages_package_id);

    if (!boughtPackage) {
        return null;
    }

    const tonAmount = new TonCurrencyAmount(dtoCharge.amount);

    return {
        id: dtoCharge.id,
        package: boughtPackage,
        date: new Date(dtoCharge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(dtoCharge.exchange_rate)
        )
    };
}

export const appMessagesStore = new AppMessagesStore();
