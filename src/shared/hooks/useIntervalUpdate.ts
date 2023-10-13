import { useEffect } from 'react';
import { useInterval } from '@chakra-ui/react';

export function useIntervalUpdate(callback: () => void, delay = 10_000): void {
    useEffect(() => {
        callback();
    }, []);
    useInterval(callback, delay);
}
