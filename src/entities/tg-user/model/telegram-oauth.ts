import { getWindow, hasProperty } from 'src/shared';

interface Options {
    bot_id: string;
    request_access?: boolean;
    lang?: string;
}

export interface TGLoginData {
    auth_date: number;
    first_name: string;
    hash: string;
    id: number;
    last_name: string;
    username: string;
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
        window.Telegram.Login.auth({ bot_id: '6287318376', request_access: true }, data => {
            res(data || null);
        });
    });
}
