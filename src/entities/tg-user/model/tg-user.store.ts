import { makeAutoObservable } from 'mobx';
import { loginViaTG } from './telegram-oauth';
import { TgUser } from './interfaces/tg-user';
import { makePersistable } from 'mobx-persist-store';
import { getWindow } from 'src/shared';

class TGUserStore {
    user: TgUser | null = null;

    isAuthProcess = false;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: 'TGUserStore',
            properties: ['user'],
            storage: getWindow()!.localStorage
        });
    }

    login = async (): Promise<void> => {
        this.isAuthProcess = true;
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        this.user = {
            id: tgOAuthResponse.id,
            firstName: tgOAuthResponse.first_name,
            lastName: tgOAuthResponse.last_name,
            imageUrl: tgOAuthResponse.photo_url
        };
        this.isAuthProcess = false;
    };

    logout = async (): Promise<void> => {
        this.user = null;
    };
}

export const tGUserStore = new TGUserStore();
