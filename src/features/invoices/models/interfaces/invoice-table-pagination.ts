import type { InvoiceStatus } from '../interfaces';
import { MonthName } from 'src/shared';

export type InvoiceTableColumn = 'id' | 'status' | 'creation-date' | 'description' | 'amount';
export type InvoiceTableSortColumn = InvoiceTableColumn;

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
              to: Date;
          };
    overpayment: boolean;
};

export function isCustomFiltrationPeriod(period: InvoiceTableFiltration['period']): period is {
    from: Date;
    to: Date;
} {
    return !!period && 'from' in period;
}

export type InvoiceTableSortDirection = 'asc' | 'desc';

export type InvoiceTableSort = { column: InvoiceTableColumn; direction: InvoiceTableSortDirection };

export type InvoicesTablePagination = {
    filter: InvoiceTableFiltration;
    sort: InvoiceTableSort;
};
