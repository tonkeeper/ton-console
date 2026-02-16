import { createContext } from 'react';
import { BillingHistoryItem } from 'src/shared/hooks/useBillingHistoryQuery';

interface BillingHistoryTableContextType {
    billingHistory: BillingHistoryItem[];
    rowHeight: string;
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
}

export const BillingHistoryTableContext = createContext<BillingHistoryTableContextType>({
    billingHistory: [],
    rowHeight: '48px'
});
