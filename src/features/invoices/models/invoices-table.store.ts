import { makeAutoObservable, reaction } from 'mobx';
import {
    apiClient,
    createImmediateReaction,
    DTOGetInvoicesParamsFieldOrder,
    DTOGetInvoicesParamsTypeOrder,
    DTOInvoicesInvoice,
    DTOInvoicesInvoiceStatus,
    Loadable,
    TonCurrencyAmount
} from 'src/shared';
import { projectsStore } from 'src/entities';
import {
    Invoice,
    InvoiceCommon,
    InvoiceForm,
    InvoicesTablePagination,
    InvoiceStatus,
    InvoiceTableColumn,
    InvoiceTableFiltration,
    InvoiceTableSort,
    InvoiceTableSortColumn
} from './interfaces';
import { invoicesAppStore } from './invoices-app.store';

class InvoicesTableStore {
    invoices$ = new Loadable<Invoice[]>([]);

    private totalInvoices = 0;

    pageSize = 30;

    pagination: InvoicesTablePagination = {
        filter: null,
        sort: {
            direction: 'desc',
            column: 'id'
        }
    };

    sortDirectionTouched = false;

    get hasNextPage(): boolean {
        return this.invoices$.value.length < this.totalInvoices;
    }

    get tableContentLength(): number {
        return this.hasNextPage ? this.invoices$.value.length + 1 : this.invoices$.value.length;
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
            const response = await this.fetchInvoices();

            const invoices = response.data.items.map(mapInvoiceDTOToInvoice);

            this.totalInvoices = response.data.count;
            return invoices;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.invoices$.createAsyncAction(async () => {
        const response = await this.fetchInvoices(this.invoices$.value.length);

        const invoices = response.data.items.map(mapInvoiceDTOToInvoice);

        this.totalInvoices = response.data.count;
        return this.invoices$.value.concat(invoices);
    });

    private async fetchInvoices(offset?: number): ReturnType<typeof apiClient.api.getInvoices> {
        const searchId = this.pagination.filter?.value;
        const sortByColumn = mapSortColumnToFieldOrder[this.pagination.sort.column];
        const sortOrder =
            this.pagination.sort.direction === 'asc'
                ? DTOGetInvoicesParamsTypeOrder.DTOAsc
                : DTOGetInvoicesParamsTypeOrder.DTODesc;

        return apiClient.api.getInvoices({
            project_id: projectsStore.selectedProject!.id,
            app_id: invoicesAppStore.invoicesApp$.value!.id,
            ...(offset !== undefined && { offset }),
            limit: this.pageSize,
            ...(searchId && { search_id: searchId }),
            field_order: sortByColumn,
            type_order: sortOrder
        });
    }

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const result = await apiClient.api.createInvoicesInvoice(
                {
                    app_id: invoicesAppStore.invoicesApp$.value!.id,
                    project_id: projectsStore.selectedProject!.id
                },
                {
                    amount: Number(form.amount.stringWeiAmount),
                    subtract_fee_from_amount: form.subtractFeeFromAmount,
                    recipient_address: form.receiverAddress,
                    description: form.description,
                    life_time: form.lifeTimeSeconds
                }
            );

            //this.fetchInvoices();

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

    setFilter = (filter: InvoiceTableFiltration): void => {
        this.pagination.filter = filter;
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

    clearState(): void {
        this.invoices$.clear();
        this.pagination = {
            filter: null,
            sort: {
                direction: 'desc',
                column: 'id'
            }
        };
        this.sortDirectionTouched = false;
    }
}

const mapInvoiceDTOStatusToInvoiceStatus: Record<DTOInvoicesInvoice['status'], InvoiceStatus> = {
    [DTOInvoicesInvoiceStatus.DTOSuccessStatus]: 'success',
    [DTOInvoicesInvoiceStatus.DTOPendingStatus]: 'pending',
    [DTOInvoicesInvoiceStatus.DTOExpiredStatus]: 'expired',
    [DTOInvoicesInvoiceStatus.DTOCancelStatus]: 'cancelled'
};

function mapInvoiceDTOToInvoice(invoiceDTO: DTOInvoicesInvoice): Invoice {
    const creationDate = new Date(invoiceDTO.date_create);
    const commonInvoice: InvoiceCommon = {
        amount: new TonCurrencyAmount(invoiceDTO.amount),
        creationDate,
        subtractFeeFromAmount: invoiceDTO.subtract_fee_from_amount,
        id: invoiceDTO.id,
        validUntil: new Date(creationDate.getTime() + invoiceDTO.life_time * 1000),
        description: invoiceDTO.description,
        receiverAddress: invoiceDTO.recipient_address
    };

    const status = mapInvoiceDTOStatusToInvoiceStatus[invoiceDTO.status];

    if (status === 'success') {
        return {
            ...commonInvoice,
            paidBy: invoiceDTO.paid_address!,
            paymentDate: new Date(invoiceDTO.date_paid!),
            status
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
               receiverAddress: 'EQCmtv9UrlDC27A0KsJNSaloAtHp5G3fli5jJjJug0waNf1u',
               subtractFeeFromAmount: true,
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

export const invoicesTableStore = new InvoicesTableStore();
