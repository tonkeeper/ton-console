import { createContext } from 'react';

export const BillingHistoryTableContext = createContext<{ rowHeight: string }>({
    rowHeight: '48px'
});
