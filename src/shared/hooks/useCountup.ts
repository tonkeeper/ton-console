import { useEffect, useState } from 'react';
import { usePrevious } from 'src/shared';

export function useCountup(
    value: number,
    options?: { frequencyMS?: number; limit: number }
): number {
    const prevValue = usePrevious(value);
    const [count, setCount] = useState(value < 0 ? 0 : value);
    const frequencyMS = options?.frequencyMS || 1000;

    const shouldComplete = options?.limit && count === options.limit;

    useEffect(() => {
        if (shouldComplete) {
            return;
        }

        const timer = setInterval(() => {
            setCount(val => val + 1);
        }, frequencyMS);
        return () => clearInterval(timer);
    }, [shouldComplete, frequencyMS]);

    useEffect(() => {
        if (prevValue !== undefined && value !== prevValue) {
            return setCount(options?.limit && value > options.limit ? options.limit : value);
        }
    }, [value, prevValue, options?.limit]);

    return count;
}
