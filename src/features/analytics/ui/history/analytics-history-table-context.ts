import { createContext } from 'react';
import { AnalyticsHistoryTableStore } from '../../model';

interface AnalyticsHistoryTableContextValue {
    rowHeight: string;
    setQueryForModal: (value: string) => void;
    analyticsHistoryTableStore: AnalyticsHistoryTableStore;
}

export const AnalyticsHistoryTableContext = createContext<AnalyticsHistoryTableContextValue | null>(
    null
) as React.Context<AnalyticsHistoryTableContextValue>;
