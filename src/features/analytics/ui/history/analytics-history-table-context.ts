import { createContext, useContext } from 'react';
import { AnalyticsHistoryTableStore } from '../../model';

interface AnalyticsHistoryTableContextValue {
    rowHeight: string;
    setQueryForModal: (value: string) => void;
    analyticsHistoryTableStore: AnalyticsHistoryTableStore;
}

export const AnalyticsHistoryTableContext = createContext<
    AnalyticsHistoryTableContextValue | undefined
>(undefined);

export function useAnalyticsHistoryTableContext(): AnalyticsHistoryTableContextValue {
    const context = useContext(AnalyticsHistoryTableContext);
    if (!context) {
        throw new Error(
            'useAnalyticsHistoryTableContext must be used within AnalyticsHistoryTableProvider'
        );
    }
    return context;
}
