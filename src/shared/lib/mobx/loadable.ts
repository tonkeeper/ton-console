import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { makePersistable } from 'mobx-persist-store';
import { deserializeState, getWindow, serializeState } from 'src/shared';

export class Loadable<T> {
    defaultValue: T;

    value: T;

    state: 'unresolved' | 'pending' | 'ready' | 'refreshing' | 'resolveErrored' | 'refetchErrored' =
        'unresolved';

    error: unknown = null;

    persistableResolved: Promise<void>;

    get isLoading(): boolean {
        return this.state === 'pending' || this.state === 'refreshing';
    }

    get isResolved(): boolean {
        return (
            this.state === 'ready' || this.state === 'refreshing' || this.state === 'refetchErrored'
        );
    }

    constructor(
        value: T,
        options?: {
            makePersistable?:
                | {
                      storeKey: string;
                      notModifyStatusBefore?: boolean;
                      notModifyStatusAfter?: boolean;
                  }
                | string;
        }
    ) {
        this.defaultValue = value;
        this.value = value;

        makeObservable(this, {
            persistableResolved: true,
            state: true,
            defaultValue: false,
            isLoading: computed,
            isResolved: computed,
            clear: action,
            createAsyncAction: false,
            error: observable,
            value: observable
        });

        if (options?.makePersistable) {
            let storeKey: string;
            let modifyStatusBefore = true;
            let modifyStatusAfter = true;

            if (typeof options.makePersistable === 'string') {
                storeKey = options.makePersistable;
            } else {
                storeKey = options.makePersistable.storeKey;
                modifyStatusBefore = !options.makePersistable.notModifyStatusBefore;
                modifyStatusAfter = !options.makePersistable.notModifyStatusAfter;
            }

            if (modifyStatusBefore) {
                this.state = 'pending';
            }

            this.persistableResolved = makePersistable(this, {
                name: storeKey,
                properties: [
                    {
                        key: 'value',
                        serialize: serializeState,
                        deserialize: deserializeState
                    }
                ],
                storage: getWindow()!.localStorage
            }) as unknown as Promise<void>;

            if (modifyStatusAfter) {
                this.persistableResolved.then(() => (this.state = 'ready'));
            }
        } else {
            this.persistableResolved = Promise.resolve();
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    createAsyncAction<A extends (...args: any[]) => Promise<T | void>>(
        asyncAction: A,
        options?: {
            successToast?: UseToastOptions;
            errorToast?: UseToastOptions;
            onError?: (e: unknown) => void;
        }
    ): ((...args: [...Parameters<A>, ({ silently?: boolean } | unknown)?]) => Promise<void>) & {
        isLoading: boolean;
        error: unknown;
    } {
        const fn = (async (...args) => {
            const callOpts = args[args.length - 1];
            const silently = Boolean(
                callOpts &&
                    typeof callOpts === 'object' &&
                    'silently' in callOpts &&
                    callOpts.silently
            );

            const changeState = (state: Loadable<unknown>['state']): void => {
                if (!silently) {
                    this.state = state;
                }
            };

            const changeError = (error: Loadable<unknown>['error']): void => {
                if (!silently) {
                    this.error = error;
                }
            };

            if (this.isResolved) {
                changeState('refreshing');
            } else {
                changeState('pending');
            }
            changeError(null);

            fn.error = null;
            fn.isLoading = true;

            try {
                const result = await asyncAction(...args);
                if (result !== undefined) {
                    runInAction(() => (this.value = result));
                }
                changeState('ready');

                if (options?.successToast) {
                    const { toast } = createStandaloneToast();
                    toast({
                        title: 'Successful action',
                        status: 'success',
                        isClosable: true,
                        ...options.successToast
                    });
                }
            } catch (e) {
                console.error(e);
                changeError(e);
                if (this.isResolved) {
                    changeState('refetchErrored');
                } else {
                    changeState('resolveErrored');
                }

                if (options?.errorToast) {
                    const { toast } = createStandaloneToast();
                    toast({
                        title: 'Unknown error',
                        description: 'Unknown api error happened. Try again later',
                        status: 'error',
                        isClosable: true,
                        ...options.errorToast
                    });
                }

                fn.error = e;
                options?.onError?.(e);
                throw e;
            } finally {
                fn.isLoading = false;
            }
        }) as ((
            ...args: [...Parameters<A>, ({ silently?: boolean } | unknown)?]
        ) => Promise<void>) & {
            isLoading: boolean;
            error: unknown;
        };

        fn.isLoading = false;
        fn.error = null;
        makeObservable(fn, {
            isLoading: observable,
            error: observable
        });

        return fn;
    }

    clear(value?: T): void {
        this.state = 'unresolved';
        this.error = null;
        this.value = value || this.defaultValue;
    }
}
