import { createContext } from 'react';
import { Invoice } from '../../models';

export const InvoicesTableContext = createContext<{
    rawHeight: string;
    invoices?: Invoice[];
    onCancel: (id: string) => Promise<void>;
    isCancelLoading: boolean;
}>({
    rawHeight: '48px',
    invoices: [],
    onCancel: async () => {},
    isCancelLoading: false
});
