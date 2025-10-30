import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'src/shared/lib/query-client';

export const withReactQuery = (component: () => ReactNode) => () =>
    <QueryClientProvider client={queryClient}>{component()}</QueryClientProvider>;
