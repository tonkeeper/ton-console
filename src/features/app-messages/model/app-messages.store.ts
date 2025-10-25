import { makeAutoObservable } from 'mobx';
import {
    createImmediateReaction,
    Loadable,
    UsdCurrencyAmount
} from 'src/shared';
import {
    getMessagesPackages,
    getProjectMessagesBalance,
    getProjectMessagesStats,
    buyMessagesPackage,
    getProjectMessagesAppToken,
    regenerateProjectMessagesAppToken,
    DTOMessagesPackage
} from 'src/shared/api';
import { dappStore, projectsStore } from 'src/shared/stores';
import { AppMessagesPackage, AppMessagesStats } from './interfaces';

export class AppMessagesStore {
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
        const { data, error } = await getMessagesPackages();
        if (error) throw error;
        return data.items.map(mapDTOPackageToAppmessagesPackage);
    });

    fetchBalance = this.balance$.createAsyncAction(async () => {
        const { data, error } = await getProjectMessagesBalance({
            query: { project_id: projectsStore.selectedProject!.id }
        });

        if (error) throw error;
        return data.balance;
    });

    fetchStats = this.stats$.createAsyncAction(async () => {
        const { data, error } = await getProjectMessagesStats({
            query: { app_id: dappStore.dapps$.value[0].id }
        });

        if (error) throw error;
        return {
            totalUsers: data.stats.users,
            usersWithEnabledNotifications: data.stats.enable_notifications,
            sentNotificationsLastWeek: data.stats.sent_in_week
        };
    });

    buyPackage = this.balance$.createAsyncAction(
        async (packageId: AppMessagesPackage['id']) => {
            const { error } = await buyMessagesPackage({
                query: { project_id: projectsStore.selectedProject!.id },
                body: { id: packageId }
            });

            if (error) throw error;
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
        const { data, error } = await getProjectMessagesAppToken({
            query: { app_id: dappStore.dapps$.value[0].id }
        });

        if (error) throw error;
        return data.token;
    });

    regenerateDappToken = this.dappToken$.createAsyncAction(
        async () => {
            const { data, error } = await regenerateProjectMessagesAppToken({
                query: { app_id: dappStore.dapps$.value[0].id }
            });

            if (error) throw error;
            return data.token;
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
