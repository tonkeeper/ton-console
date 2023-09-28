import { useEffect, useRef } from 'react';

export function usePrevious<T>(prop: T): T | undefined {
    const prev = useRef<T | undefined>();

    useEffect(() => {
        prev.current = prop;
    }, [prop]);

    return prev.current;
}
