import { makeAutoObservable } from 'mobx';
import { loginViaTG } from './telegram-oauth';
import { User } from './interfaces/user';
import { apiClient, DTOUser, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';
import { AxiosError } from 'axios';

class UserStore {
    user$ = new Loadable<User | null>(null, {
        makePersistable: { storeKey: 'User', notModifyStatusAfter: true }
    });

    constructor() {
        makeAutoObservable(this);

        this.user$.persistableResolved.then(async () => {
            if (this.user$.value) {
                await this.logoutIfSessionExpired();
            }
            this.user$.state = 'ready';
        });
    }

    login = this.user$.createAsyncAction(async () => {
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        await apiClient.api.authViaTg(tgOAuthResponse);

        const userRes = await apiClient.api.getUserInfo();

        await projectsStore.fetchProjects();
        if (projectsStore.projects$.value.length && !projectsStore.selectedProject) {
            projectsStore.selectProject(projectsStore.projects$.value[0].id);
        }

        return mapDTOUserToUser(userRes.data.user);
    });

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
        imageUrl: user.avatar
    };
}

export const userStore = new UserStore();
