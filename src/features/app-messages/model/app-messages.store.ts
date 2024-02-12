import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    DTOMessagesPackage,
    Loadable,
    UsdCurrencyAmount
} from 'src/shared';
import { dappStore, projectsStore } from 'src/entities';
import { AppMessagesPackage, AppMessagesStats } from './interfaces';

class AppMessagesStore {
    packages$ = new Loadable<AppMessagesPackage[]>([]);

    balance$ = new Loadable<number>(0);

    stats$ = new Loadable<AppMessagesStats | null>(null);

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

export const appMessagesStore = new AppMessagesStore();
