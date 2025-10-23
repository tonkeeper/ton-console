import { createContext } from 'react';
import type { BillingStore } from '../model';

interface BillingHistoryTableContextType {
    billingStore?: BillingStore;
    rowHeight: string;
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
}

export const BillingHistoryTableContext = createContext<BillingHistoryTableContextType>({
    rowHeight: '48px'
});
