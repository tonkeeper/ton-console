import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMS?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delayMS || 500);

        return () => clearTimeout(timer);
    }, [value, delayMS]);

    return debouncedValue;
}
