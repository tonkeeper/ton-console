import { makeAutoObservable } from 'mobx';
import { loginViaTG } from './telegram-oauth';
import { User } from './interfaces/user';
import { apiClient, DTOUser, Loadable } from 'src/shared';
import { projectsStore } from 'src/shared/stores';
import { AxiosError } from 'axios';

export class UserStore {
    user$ = new Loadable<User | null>(null, {
        makePersistable: { storeKey: 'User', notModifyStatusAfter: true }
    });

    // referrals$ = new Loadable<{ items: Array<DTOReferral>; totalProfit: number } | null>(
    //     null,
    //     {
    //         makePersistable: { storeKey: 'UserReferrals', notModifyStatusAfter: false }
    //     }
    // );

    constructor() {
        makeAutoObservable(this);

        this.user$.persistableResolved.then(async () => {
            if (this.user$.value) {
                await this.logoutIfSessionExpired();
            }
            this.user$.state = 'ready';
        });
    }

    private async fetchMe() {
        const userRes = await apiClient.api.getUserInfo();
        return mapDTOUserToUser(userRes.data.user);
    }

    login = this.user$.createAsyncAction(async () => {
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        const url = window.location.href;
        const params = new URLSearchParams(new URL(url).search);
        const referral_id = params.get('referral') ?? undefined;

        await apiClient.api.authViaTg({ ...tgOAuthResponse, referral_id });

        await projectsStore.fetchProjects();
        if (projectsStore.projects$.value.length && !projectsStore.selectedProject) {
            projectsStore.selectProject(projectsStore.projects$.value[0].id);
        }

        return this.fetchMe();
    });

    updateMe = this.user$.createAsyncAction(async () => {
        return this.fetchMe();
    });

    // fetchReferrals = this.referrals$.createAsyncAction(async () => {
    //     try {
    //         const response = await apiClient.api.getUserReferrals();
    //         const { items, total_profit: totalProfit } = response.data;

    //         return {
    //             items,
    //             totalProfit
    //         };
    //     } catch (e) {
    //         if (e instanceof AxiosError) {
    //             console.error('Failed to fetch referrals:', e.message);
    //         }
    //         throw e;
    //     }
    // });

    logoutIfSessionExpired = this.user$.createAsyncAction(async () => {
        try {
            await projectsStore.fetchProjects();
        } catch (e) {
            if (e instanceof AxiosError && e.response?.status === 401) {
                await this.logout();
            }
        }
    });

    logout = this.user$.createAsyncAction(async () => {
        try {
            await apiClient.api.accountLogout();
        } catch (e) {
            console.error(e);
        }

        this.user$.value = null;
        // this.referrals$.value = null;
    });

    isAuthorized(): this is { user$: Loadable<User> } {
        return !!this.user$.value;
    }
}

function mapDTOUserToUser(user: DTOUser): User {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        name: [user.first_name, user.last_name].join(' '),
        imageUrl: user.avatar,
        referralId: user.referral_id,
        referralCount: user.referrals_count
    };
}
