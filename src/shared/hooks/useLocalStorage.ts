import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (parseJSON(item) as T) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue: SetValue<T> = useCallback(
        value => {
            // Prevent build error "window is undefined" but keeps working
            if (typeof window === 'undefined') {
                console.error(
                    `Tried setting localStorage key “${key}” even though environment is not a client`
                );
            }

            try {
                const newValue = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, JSON.stringify(newValue));
                setStoredValue(newValue);
            } catch (error) {
                console.error(`Error setting localStorage key “${key}”:`, error);
            }
        },
        [key, storedValue]
    );

    useEffect(() => {
        setStoredValue(readValue());
    }, []);

    return [storedValue, setValue];
}

function parseJSON<T>(value: string | null): T | undefined {
    try {
        return value === 'undefined' ? undefined : JSON.parse(value ?? '');
    } catch {
        console.error('parsing error on', { value });
        return undefined;
    }
}
