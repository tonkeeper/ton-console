import { makeAutoObservable } from 'mobx';
import { loginViaTG } from './telegram-oauth';
import { TgUser } from './interfaces/tg-user';

class TGUserStore {
    user: TgUser | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    login = async (): Promise<void> => {
        const tgOAuthResponse = await loginViaTG();

        if (!tgOAuthResponse) {
            return;
        }

        this.user = {
            id: tgOAuthResponse.id,
            firstName: tgOAuthResponse.first_name,
            lastName: tgOAuthResponse.last_name
        };
    };
}

export const tGUserStore = new TGUserStore();
