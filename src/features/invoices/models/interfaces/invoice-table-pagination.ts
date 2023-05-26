import type { InvoiceStatus } from '../interfaces';

export type InvoiceTableColumn = 'id' | 'status' | 'creation-date' | 'description' | 'amount';
export type InvoiceTableSortColumn = InvoiceTableColumn;

export type InvoiceTableFiltration = {
    id?: string;
    status?: InvoiceStatus[];
};

export type InvoiceTableSortDirection = 'asc' | 'desc';

export type InvoiceTableSort = { column: InvoiceTableColumn; direction: InvoiceTableSortDirection };

export type InvoicesTablePagination = {
    filter: InvoiceTableFiltration;
    sort: InvoiceTableSort;
};
