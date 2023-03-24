import { autorun } from 'mobx';

export function createEffect(...args: Parameters<typeof autorun>): void {
    setTimeout(() => autorun(...args));
}
