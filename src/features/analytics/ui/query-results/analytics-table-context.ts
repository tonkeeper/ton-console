import { createContext } from 'react';

export const AnalyticsTableContext = createContext<{ rawHeight: string }>({ rawHeight: '48px' });
