import { createContext } from 'react';

export const AnalyticsHistoryTableContext = createContext<{ rowHeight: string }>({
    rowHeight: '68px'
});
