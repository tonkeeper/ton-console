import { createContext } from 'react';

export const InvoicesTableContext = createContext<{ rawHeight: string }>({ rawHeight: '12' });
