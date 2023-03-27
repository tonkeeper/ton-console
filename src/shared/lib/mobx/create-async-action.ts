import { makeObservable, observable } from 'mobx';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function createAsyncAction<T extends (...args: any[]) => Promise<void>>(
    action: T,
    onError?: (e: unknown) => void
): T & { isLoading: boolean; error: unknown } {
    const fn = (async (...args) => {
        fn.error = '';
        fn.isLoading = true;

        try {
            await action(...args);
        } catch (e) {
            fn.error = e;
            onError?.(e);
            throw e;
        } finally {
            fn.isLoading = false;
        }
    }) as T & {
        isLoading: boolean;
        error: unknown;
    };

    fn.isLoading = false;
    fn.error = '';
    makeObservable(fn, {
        isLoading: observable,
        error: observable
    });

    return fn;
}
