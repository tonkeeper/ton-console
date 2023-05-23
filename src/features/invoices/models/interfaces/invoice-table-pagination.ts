export type InvoiceTableColumn =
    | 'id'
    | 'status'
    | 'life-time'
    | 'description'
    | 'receiver-address'
    | 'amount';
export type InvoiceTableFiltrationColumn = Extract<'id', InvoiceTableColumn>;
export type InvoiceTableSortColumn = InvoiceTableColumn;

export type InvoiceTableFiltration = { column: InvoiceTableFiltrationColumn; value: string } | null;

export type InvoiceTableSortDirection = 'asc' | 'desc';

export type InvoiceTableSort = { column: InvoiceTableColumn; direction: InvoiceTableSortDirection };

export type InvoicesTablePagination = {
    filter: InvoiceTableFiltration;
    sort: InvoiceTableSort;
};
