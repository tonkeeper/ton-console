import { createContext } from 'react';

export const AnalyticsHistoryTableContext = createContext<{
    rowHeight: string;
    setQueryForModal: (value: string) => void;
}>({
    rowHeight: '68px',
    setQueryForModal: () => {}
});
