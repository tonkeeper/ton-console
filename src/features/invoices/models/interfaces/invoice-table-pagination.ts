export type InvoiceTableColumn = 'id' | 'status' | 'creation-date' | 'description' | 'amount';
export type InvoiceTableFiltrationColumn = Extract<'id', InvoiceTableColumn>;
export type InvoiceTableSortColumn = InvoiceTableColumn;

export type InvoiceTableFiltration = { column: InvoiceTableFiltrationColumn; value: string } | null;

export type InvoiceTableSortDirection = 'asc' | 'desc';

export type InvoiceTableSort = { column: InvoiceTableColumn; direction: InvoiceTableSortDirection };

export type InvoicesTablePagination = {
    filter: InvoiceTableFiltration;
    sort: InvoiceTableSort;
};
