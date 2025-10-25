import { ReactNode } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false
        },
        mutations: {
            retry: 1
        }
    }
});

export const withReactQuery = (component: () => ReactNode) => () =>
    <QueryClientProvider client={queryClient}>{component()}</QueryClientProvider>;
