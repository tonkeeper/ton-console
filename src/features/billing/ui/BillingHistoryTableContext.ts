import { createContext } from 'react';

interface BillingHistoryTableContextType {
    rowHeight: string;
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
}

export const BillingHistoryTableContext = createContext<BillingHistoryTableContextType>({
    rowHeight: '48px'
});
