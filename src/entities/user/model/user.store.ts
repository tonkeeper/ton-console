import { makeAutoObservable } from 'mobx';
import { loginViaTG, TGLoginData } from './telegram-oauth';
import { User } from './interfaces/user';
import { apiClient, Loadable } from 'src/shared';
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

        await projectsStore.fetchProjects();
        if (projectsStore.projects$.value.length && !projectsStore.selectedProject) {
            projectsStore.selectProject(projectsStore.projects$.value[0].id);
        }

        return mapTgUserDTOToUser(tgOAuthResponse);
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
}

function mapTgUserDTOToUser(userTg: TGLoginData): User {
    return {
        id: userTg.id,
        firstName: userTg.first_name,
        lastName: userTg.last_name,
        imageUrl: userTg.photo_url
    };
}

export const userStore = new UserStore();
