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
            setValue: action,
            setStartLoading: action,
            setEndLoading: action,
            setErroredState: action,
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

    createAsyncAction<
        N extends boolean,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        A extends (...args: any[]) => Promise<N extends true ? unknown : T | void>
    >(
        asyncAction: A,
        options?: {
            notMutateState?: N;
            successToast?: UseToastOptions;
            errorToast?: UseToastOptions | ((e: unknown) => UseToastOptions);
            onError?: (e: unknown) => void;
            resetBeforeExecution?: boolean;
        }
    ): ((
        ...args: [
            ...Parameters<A>,
            { silently?: boolean; cancelPreviousCall?: boolean; cancelAllPreviousCalls?: boolean }?
        ]
    ) => ReturnType<A>) & {
        isLoading: boolean;
        error: unknown;
        cancelLastCall: () => void;
        cancelAllPendingCalls: () => void;
    } {
        const fn = (async (...args) => {
            if (options?.resetBeforeExecution) {
                this.clear();
            }

            const callOpts = args[args.length - 1];

            const lastCallId = fn.pendingCallsIds.at(-1);

            let silently = false;
            if (callOpts && typeof callOpts === 'object') {
                silently = 'silently' in callOpts && !!callOpts.silently;

                if (
                    'cancelPreviousCall' in callOpts &&
                    !!callOpts.cancelPreviousCall &&
                    lastCallId !== undefined
                ) {
                    fn.shouldCancelCallsIds.push(lastCallId);
                }

                if ('cancelAllPreviousCalls' in callOpts && !!callOpts.cancelAllPreviousCalls) {
                    fn.shouldCancelCallsIds = fn.pendingCallsIds.slice();
                }
            }

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
            const callId = (lastCallId || 0) + 1;
            fn.pendingCallsIds.push(callId);

            try {
                const result = await asyncAction(...args);

                fn.pendingCallsIds = fn.pendingCallsIds.filter(id => id !== callId);
                if (fn.shouldCancelCallsIds.includes(callId)) {
                    fn.shouldCancelCallsIds = fn.shouldCancelCallsIds.filter(id => id !== callId);
                    return;
                }

                if (result !== undefined && !options?.notMutateState) {
                    runInAction(() => (this.value = result as T));
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
                return result;
            } catch (e) {
                changeError(e);
                if (this.isResolved) {
                    changeState('refetchErrored');
                } else {
                    changeState('resolveErrored');
                }

                if (options?.errorToast) {
                    let opts = options.errorToast;
                    if (typeof options.errorToast === 'function') {
                        opts = options.errorToast(e);
                    }

                    const { toast } = createStandaloneToast();
                    toast({
                        title: 'Unknown error',
                        description: 'Unknown api error happened. Try again later',
                        status: 'error',
                        isClosable: true,
                        ...opts
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
        ) => ReturnType<A>) & {
            isLoading: boolean;
            error: unknown;
            cancelLastCall: () => void;
            cancelAllPendingCalls: () => void;
            pendingCallsIds: number[];
            shouldCancelCallsIds: number[];
        };

        fn.shouldCancelCallsIds = [];
        fn.pendingCallsIds = [];
        fn.cancelLastCall = () => {
            const lastCallId = fn.pendingCallsIds.at(-1);
            if (lastCallId === undefined) {
                return;
            }

            fn.shouldCancelCallsIds.push(lastCallId);
        };
        fn.cancelAllPendingCalls = () => {
            fn.shouldCancelCallsIds = fn.pendingCallsIds.slice();
        };

        fn.isLoading = false;
        fn.error = null;
        makeObservable(fn, {
            isLoading: observable,
            error: observable
        });

        return fn;
    }

    public setValue(value: T): void {
        this.value = value;
    }

    public setStartLoading(): void {
        if (this.isResolved) {
            this.state = 'refreshing';
        } else {
            this.state = 'pending';
        }
    }

    public setEndLoading(): void {
        this.state = 'ready';
    }

    public setErroredState(e: unknown): void {
        this.error = e;

        if (this.isResolved) {
            this.state = 'refetchErrored';
        } else {
            this.state = 'resolveErrored';
        }
    }

    clear(value?: T): void {
        this.state = 'unresolved';
        this.error = null;
        this.value = value || this.defaultValue;
    }
}
