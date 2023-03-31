import { makeAutoObservable } from 'mobx';
import { loginViaTG } from './telegram-oauth';
import { TgUser } from './interfaces/tg-user';
import { makePersistable } from 'mobx-persist-store';
import { apiClient, deserializeState, getWindow, serializeState } from 'src/shared';
import { projectsStore } from 'src/entities/project';

class TGUserStore {
    user: TgUser | null = null;

    isAuthProcess = false;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'TGUserStore',
            properties: [
                {
                    key: 'user',
                    serialize: serializeState,
                    deserialize: deserializeState
                }
            ],
            storage: getWindow()!.localStorage
        });
    }

    login = async (): Promise<void> => {
        this.isAuthProcess = true;
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        await apiClient.api.authViaTg(tgOAuthResponse);

        await projectsStore.fetchProjects();

        this.user = {
            id: tgOAuthResponse.id,
            firstName: tgOAuthResponse.first_name,
            lastName: tgOAuthResponse.last_name,
            imageUrl: tgOAuthResponse.photo_url
        };
        this.isAuthProcess = false;
    };

    logout = async (): Promise<void> => {
        await apiClient.api.accountLogout();
        this.user = null;
    };
}

export const tGUserStore = new TGUserStore();
