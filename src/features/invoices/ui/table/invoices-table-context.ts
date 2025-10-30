import { createContext } from 'react';
import { InvoicesTableStore } from '../../models';

export const InvoicesTableContext = createContext<{
    rawHeight: string;
    invoicesTableStore: InvoicesTableStore;
}>({
    rawHeight: '12',
    invoicesTableStore: {} as InvoicesTableStore
});
