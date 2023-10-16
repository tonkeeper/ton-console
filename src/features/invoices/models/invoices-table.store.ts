import { makeAutoObservable, reaction } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    createTransferLink,
    DTOGetInvoicesParamsFieldOrder,
    DTOGetInvoicesParamsTypeOrder,
    DTOInvoicesInvoice,
    DTOInvoiceStatus,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import {
    Invoice,
    InvoiceCommon,
    InvoiceForm,
    InvoicesTablePagination,
    InvoiceStatus,
    InvoiceTableColumn,
    InvoiceTableSort,
    InvoiceTableSortColumn
} from './interfaces';
import { invoicesAppStore } from './invoices-app.store';

class InvoicesTableStore {
    invoices$ = new Loadable<Invoice[]>([]);

    private totalInvoices = 0;

    pageSize = 30;

    pagination: InvoicesTablePagination = {
        filter: {
            overpayment: false
        },
        sort: {
            direction: 'desc',
            column: 'creation-date'
        }
    };

    sortDirectionTouched = false;

    get hasNextPage(): boolean {
        return this.invoices$.value.length < this.totalInvoices;
    }

    get tableContentLength(): number {
        return this.hasNextPage ? this.invoices$.value.length + 1 : this.invoices$.value.length;
    }

    get isFilterEmpty(): boolean {
        return !this.pagination.filter.status && !this.pagination.filter.id;
    }

    constructor() {
        makeAutoObservable(this);

        let dispose: (() => void) | undefined;

        createImmediateReaction(
            () => invoicesAppStore.invoicesApp$.value,
            app => {
                dispose?.();
                this.clearState();
                this.loadFirstPageWithNewParams.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (app) {
                    this.loadFirstPageWithNewParams();

                    dispose = reaction(
                        () => JSON.stringify(this.pagination),
                        () => {
                            this.loadFirstPageWithNewParams({ cancelPreviousCall: true });
                        }
                    );
                }
            }
        );
    }

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.invoices$.value.length;

    loadFirstPageWithNewParams = this.invoices$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();

            const response = await this.fetchInvoices();

            const invoices = response.data.items.map(mapInvoiceDTOToInvoice);

            this.totalInvoices = response.data.count;
            return invoices;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.invoices$.createAsyncAction(async () => {
        const response = await this.fetchInvoices({ offset: this.invoices$.value.length });

        const invoices = response.data.items.map(mapInvoiceDTOToInvoice);

        this.totalInvoices = response.data.count;
        return this.invoices$.value.concat(invoices);
    });

    updateCurrentListSilently = this.invoices$.createAsyncAction(async () => {
        const response = await this.fetchInvoices();

        const invoices = response.data.items.map(mapInvoiceDTOToInvoice);

        this.totalInvoices = response.data.count;
        return invoices;
    });

    private async fetchInvoices(options?: {
        offset?: number;
        pageSize?: number;
    }): ReturnType<typeof apiClient.api.getInvoices> {
        const searchId = this.pagination.filter.id;
        let filterByStatus = undefined;

        if (this.pagination.filter.status?.length) {
            filterByStatus = this.pagination.filter.status.map(
                i => mapInvoiceStatusToInvoiceDTOStatus[i]
            );
        }

        const sortByColumn = mapSortColumnToFieldOrder[this.pagination.sort.column];
        const sortOrder =
            this.pagination.sort.direction === 'asc'
                ? DTOGetInvoicesParamsTypeOrder.DTOAsc
                : DTOGetInvoicesParamsTypeOrder.DTODesc;

        return apiClient.api.getInvoices({
            app_id: invoicesAppStore.invoicesApp$.value!.id,
            ...(options?.offset !== undefined && { offset: options.offset }),
            limit: options?.pageSize || this.pageSize,
            ...(searchId && { search_id: searchId }),
            field_order: sortByColumn,
            type_order: sortOrder,
            filter_status: filterByStatus,
            ...(this.pagination.filter.overpayment && { overpayment: true })
        });
    }

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const result = await apiClient.api.createInvoicesInvoice(
                {
                    app_id: invoicesAppStore.invoicesApp$.value!.id
                },
                {
                    amount: form.amount.stringWeiAmount,
                    description: form.description,
                    life_time: form.lifeTimeSeconds
                }
            );

            await this.updateCurrentListSilently({ silently: true });

            return mapInvoiceDTOToInvoice(result.data.invoice);
        },
        {
            notMutateState: true,
            successToast: {
                title: 'Invoice created successfully'
            },
            errorToast: {
                title: 'Invoice creation error'
            }
        }
    );

    cancelInvoice = this.invoices$.createAsyncAction(
        async (id: Invoice['id']) => {
            await apiClient.api.cancelInvoicesInvoice(id, {
                app_id: invoicesAppStore.invoicesApp$.value!.id
            });
            await this.updateCurrentListSilently({ silently: true });
        },
        {
            successToast: {
                title: 'Invoice cancelled successfully'
            },
            errorToast: {
                title: 'Invoice cancellation error'
            }
        }
    );

    markInvoiceAsRefunded = this.invoices$.createAsyncAction(
        async (form: { id: Invoice['id']; refundedAmount: number }) => {
            await apiClient.api.updateInvoicesInvoice(
                form.id,
                {
                    app_id: invoicesAppStore.invoicesApp$.value!.id
                },
                {
                    refunded: true,
                    refund_amount: form.refundedAmount
                }
            );
            await this.updateCurrentListSilently({ silently: true });
        },
        {
            successToast: {
                title: 'Invoice marked as refunded successfully'
            },
            errorToast: {
                title: 'Invoice was not marked as refunded'
            }
        }
    );

    setFilterById = (value: string | undefined): void => {
        this.pagination.filter.id = value;
    };

    setSort = (sort: InvoiceTableSort): void => {
        this.sortDirectionTouched = true;
        this.pagination.sort = sort;
    };

    toggleSortDirection = (): void => {
        this.sortDirectionTouched = true;
        this.pagination.sort.direction = this.pagination.sort.direction === 'asc' ? 'desc' : 'asc';
    };

    setSortColumn = (column: InvoiceTableColumn): void => {
        this.sortDirectionTouched = true;
        this.pagination.sort.column = column;
        this.pagination.sort.direction = 'desc';
    };

    toggleFilterByStatus = (status: InvoiceStatus): void => {
        const statusActive = this.pagination.filter.status?.includes(status);
        if (statusActive) {
            this.pagination.filter.status = this.pagination.filter.status?.filter(
                i => i !== status
            );
        } else {
            this.pagination.filter.status = (this.pagination.filter.status || []).concat(status);
        }
    };

    toggleFilterByOverpayment = (): void => {
        this.pagination.filter.overpayment = !this.pagination.filter.overpayment;
    };

    clearFilterByStatus = (): void => {
        this.pagination.filter.status = undefined;
    };

    clearState(): void {
        this.invoices$.clear();
        this.pagination = {
            filter: {
                overpayment: false
            },
            sort: {
                direction: 'desc',
                column: 'creation-date'
            }
        };
        this.sortDirectionTouched = false;
    }
}

const mapInvoiceDTOStatusToInvoiceStatus: Record<DTOInvoicesInvoice['status'], InvoiceStatus> = {
    [DTOInvoiceStatus.DTOPaid]: 'success',
    [DTOInvoiceStatus.DTOPending]: 'pending',
    [DTOInvoiceStatus.DTOExpired]: 'expired',
    [DTOInvoiceStatus.DTOCancelled]: 'cancelled'
};

const mapInvoiceStatusToInvoiceDTOStatus: Record<InvoiceStatus, DTOInvoicesInvoice['status']> =
    Object.fromEntries(Object.entries(mapInvoiceDTOStatusToInvoiceStatus).map(a => a.reverse()));

function mapInvoiceDTOToInvoice(invoiceDTO: DTOInvoicesInvoice): Invoice {
    const creationDate = new Date(invoiceDTO.date_create);
    const commonInvoice: InvoiceCommon = {
        amount: new TonCurrencyAmount(invoiceDTO.amount),
        creationDate,
        id: invoiceDTO.id,
        validUntil: new Date(creationDate.getTime() + invoiceDTO.life_time * 1000),
        description: invoiceDTO.description,
        payTo: invoiceDTO.pay_to_address,
        overpayment: invoiceDTO.overpayment
            ? new TonCurrencyAmount(invoiceDTO.overpayment)
            : undefined,
        refundDate: invoiceDTO.date_refund ? new Date(invoiceDTO.date_refund) : undefined,
        refundedAmount: invoiceDTO.refund_amount
            ? new TonCurrencyAmount(invoiceDTO.refund_amount)
            : undefined
    };

    const status = mapInvoiceDTOStatusToInvoiceStatus[invoiceDTO.status];

    if (status === 'success') {
        return {
            ...commonInvoice,
            paidBy: invoiceDTO.paid_by_address!,
            paymentDate: new Date(invoiceDTO.date_paid!),
            status
        };
    }

    if (status === 'cancelled') {
        return {
            ...commonInvoice,
            status,
            cancellationDate: new Date(invoiceDTO.date_cancelled!)
        };
    }

    return { ...commonInvoice, status };
}
/*
function createMockInvoice(): Invoice {
    const id = Math.round(Math.random() * 1000000);
    const status = (['pending', 'success', 'cancelled', 'expired'] as const)[id % 4];

    return {
        amount: new TonCurrencyAmount(1000000000),
        creationDate: new Date(),
        status,
        subtractFeeFromAmount: true,
        id: id.toString(),
        validUntil: new Date(Date.now() + 1000 * 3600 * 24),
        description:
            'TestdescripotionTestdescripotionTestdescripotionTestdescripotionTestdescripotionTest descripotionTest descripotionTestdescripotion',
        receiverAddress: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u',
        ...(status === 'success' && {
            paidBy: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u',
            paymentDate: new Date()
        })
    } as Invoice;
}*/
/*
[...new Array(500)].forEach(() => {
           const ttl = 10000 * Math.round(Math.random() * 10);
           this.createInvoice({
               amount: TonCurrencyAmount.fromRelativeAmount(
                   Math.round(Math.random() * 1000000) / 1000
               ),
               description: 'Tag ' + Math.round(Math.random() * 1000).toString(),
               lifeTimeSeconds: ttl < 1000 ? 1000 : ttl
           });
       });*/

const mapSortColumnToFieldOrder: Record<InvoiceTableSortColumn, DTOGetInvoicesParamsFieldOrder> = {
    id: DTOGetInvoicesParamsFieldOrder.DTOId,
    description: DTOGetInvoicesParamsFieldOrder.DTODescription,
    amount: DTOGetInvoicesParamsFieldOrder.DTOAmount,
    status: DTOGetInvoicesParamsFieldOrder.DTOStatus,
    'creation-date': DTOGetInvoicesParamsFieldOrder.DTODateCreate
};

export function createInvoicePaymentLink(invoice: Invoice): string {
    return createTransferLink({
        address: invoice.payTo,
        amount: invoice.amount,
        text: invoice.id,
        exp: invoice.validUntil
    });
}

export const invoicesTableStore = new InvoicesTableStore();
