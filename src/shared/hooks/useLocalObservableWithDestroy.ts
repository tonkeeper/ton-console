import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';

interface Destroyable {
    destroy?: () => void;
}

/**
 * Creates a local MobX observable store with automatic cleanup on unmount.
 * Ensures that store.destroy() is called when the component unmounts.
 *
 * @template T - The type of store to create
 * @param createStore - Factory function that creates the store instance
 * @returns The store instance
 *
 * @example
 * const store = useLocalObservableWithDestroy(() => new MyStore());
 *
 * @remarks
 * This hook is a wrapper around useLocalObservable that automatically:
 * 1. Creates a new store instance scoped to this component
 * 2. Calls store.destroy() when the component unmounts
 * 3. Ensures all MobX reactions and resources are properly cleaned up
 *
 * The store must have an optional destroy() method for cleanup.
 */
export function useLocalObservableWithDestroy<T extends Destroyable>(
    createStore: () => T
): T {
    const store = useLocalObservable(createStore);

    useEffect(() => {
        return () => {
            store.destroy?.();
        };
    }, [store]);

    return store;
}
