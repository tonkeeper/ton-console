import { useCallback } from 'react';
import { useSearchParams as useSearchParamsRRD } from 'react-router-dom';

export const useSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParamsRRD();
    const updateSearchParams = useCallback(
        (params: Record<string, string | null>) => {
            const updatedParams = new URLSearchParams(searchParams);
            Object.entries(params).forEach(([key, value]) => {
                if (value === null) {
                    updatedParams.delete(key);
                    return;
                }
                updatedParams.set(key, value);
            });
            setSearchParams(updatedParams);
        },
        [searchParams, setSearchParams]
    );
    return { searchParams, setSearchParams, updateSearchParams };
};
