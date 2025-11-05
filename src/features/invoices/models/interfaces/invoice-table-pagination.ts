import type { InvoiceStatus, InvoiceCurrency } from '../interfaces';
import { DTOInvoiceFieldOrder, GetInvoicesData, MonthName } from 'src/shared';

export type InvoiceTableFiltration = {
    id?: string;
    status?: InvoiceStatus[];
    period?:
        | {
              month: MonthName;
              year: number;
          }
        | {
              from: Date;
              to: Date; // inclusive
          };
    currency?: InvoiceCurrency[];
    overpayment: boolean;
};

export function isCustomFiltrationPeriod(period: InvoiceTableFiltration['period']): period is {
    from: Date;
    to: Date;
} {
    return !!period && 'from' in period;
}

export type InvoiceTableSortDirection = GetInvoicesData['query']['type_order'];

export type InvoiceTableSort = {
    column: DTOInvoiceFieldOrder;
    direction: InvoiceTableSortDirection;
};

export type InvoicesTablePagination = {
    filter: InvoiceTableFiltration;
    sort: InvoiceTableSort;
};
