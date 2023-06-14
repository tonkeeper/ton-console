import { makeAutoObservable } from 'mobx';
import { loginViaTG, TGLoginData } from './telegram-oauth';
import { TgUser } from './interfaces/tg-user';
import { apiClient, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';
import { AxiosError } from 'axios';

class TGUserStore {
    user$ = new Loadable<TgUser | null>(null, {
        makePersistable: { storeKey: 'TGUser', notModifyStatusAfter: true }
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

        await projectsStore.fetchProjects(); // TODO вынести в стор-фасад для авторизации
        if (projectsStore.projects$.value.length && !projectsStore.selectedProject) {
            projectsStore.selectProject(projectsStore.projects$.value[0].id);
        }

        this.user$.value = mapTgUserDTOToTgUser(tgOAuthResponse);
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

function mapTgUserDTOToTgUser(userDTO: TGLoginData): TgUser {
    return {
        id: userDTO.id,
        firstName: userDTO.first_name,
        lastName: userDTO.last_name,
        imageUrl: userDTO.photo_url
    };
}

export const tGUserStore = new TGUserStore();
