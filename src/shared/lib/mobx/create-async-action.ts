import { makeAutoObservable } from 'mobx';

export function createAsyncAction<T extends (...args: unknown[]) => Promise<void>>(
    action: T
): T & { isLoading: boolean; error: unknown } {
    const fn = (async (...args) => {
        fn.error = '';
        fn.isLoading = true;

        try {
            await action(...args);
        } catch (e) {
            fn.error = e;
        }

        fn.isLoading = false;
    }) as T & {
        isLoading: boolean;
        error: unknown;
    };

    fn.isLoading = false;
    fn.error = '';
    makeAutoObservable(fn);

    return fn;
}
