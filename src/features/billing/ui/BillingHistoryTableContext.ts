import { createContext } from 'react';
import type { BillingHistoryItem } from '../model';

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
