import { makeAutoObservable } from 'mobx';
import { loginViaTG, TGLoginData } from './telegram-oauth';
import { TgUser } from './interfaces/tg-user';
import { apiClient, Loadable } from 'src/shared';
import { projectsStore } from 'src/entities';

class TGUserStore {
    user$ = new Loadable<TgUser | null>(null, { makePersistableAs: 'TGUser' });

    constructor() {
        makeAutoObservable(this);
    }

    login = this.user$.createAsyncAction(async () => {
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        await apiClient.api.authViaTg(tgOAuthResponse);

        await projectsStore.fetchProjects(); // TODO вынести в стор-фасад для авторизации
        if (projectsStore.projects$.value.length) {
            projectsStore.selectProject(projectsStore.projects$.value[0].id);
        }

        this.user$.value = mapTgUserDTOToTgUser(tgOAuthResponse);
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
