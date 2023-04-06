import { getWindow, hasProperty } from 'src/shared';

interface Options {
    bot_id: string;
    request_access?: string;
    lang?: string;
}

export interface TGLoginData {
    auth_date: number;
    first_name: string;
    hash: string;
    id: number;
    last_name: string;
    username: string;

    photo_url: string;
}

type Callback = (dataOrFalse: TGLoginData | false) => void;

function isTGAvailable(window: Window): window is Window & {
    Telegram: { Login: { auth: (options: Options, callback: Callback) => void } };
} {
    return (
        hasProperty(window, 'Telegram') &&
        hasProperty(window.Telegram, 'Login') &&
        hasProperty(window.Telegram.Login, 'auth') &&
        typeof window.Telegram.Login.auth === 'function'
    );
}

export async function loginViaTG(): Promise<TGLoginData | null> {
    const window = getWindow();
    if (!window) {
        return null;
    }

    if (!isTGAvailable(window)) {
        throw new Error('Telegram auth provider not found');
    }
    return new Promise(res => {
        window.Telegram.Login.auth(
            { bot_id: import.meta.env.VITE_TG_OAUTH_BOT_ID, request_access: 'write' },
            data => {
                res(data || null);
            }
        );
    });
}
