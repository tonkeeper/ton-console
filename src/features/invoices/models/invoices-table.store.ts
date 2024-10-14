import { makeAutoObservable, reaction } from 'mobx';
import {
    apiClient,
    backendBaseURL,
    createImmediateReaction,
    CRYPTO_CURRENCY,
    DTOCryptoCurrency,
    DTOGetInvoicesParamsTypeOrderEnum,
    DTOInvoiceFieldOrder,
    DTOInvoicesInvoice,
    DTOInvoiceStatus,
    Loadable,
    monthsNames,
    TonAddress
} from 'src/shared';
import {
    Invoice,
    InvoiceCommon,
    InvoiceCurrency,
    InvoiceForm,
    InvoicesTablePagination,
    InvoiceStatus,
    InvoiceTableColumn,
    InvoiceTableFiltration,
    InvoiceTableSort,
    InvoiceTableSortColumn,
    isCustomFiltrationPeriod
} from './interfaces';
import { invoicesAppStore } from './invoices-app.store';
import {
    convertCryptoCurrencyToDTOCryptoCurrency,
    convertDTOCryptoCurrencyToCryptoCurrency,
    getTokenCurrencyAmountFromDTO
} from './utils';

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
        return (
            !this.pagination.filter.status &&
            !this.pagination.filter.currency &&
            !this.pagination.filter.id &&
            !this.pagination.filter.overpayment
        );
    }

    get downloadInvoicesLink(): string {
        const path = '/api/v1/services/invoices/export';
        const url = new URL(path, backendBaseURL);
        url.searchParams.append('app_id', invoicesAppStore.invoicesApp$.value!.id.toString());

        if (this.pagination.filter.id !== undefined) {
            url.searchParams.append('search_id', this.pagination.filter.id);
        }
        const sortByColumn = mapSortColumnToFieldOrder[this.pagination.sort.column];
        const sortOrder =
            this.pagination.sort.direction === 'asc'
                ? DTOGetInvoicesParamsTypeOrderEnum.DTOAsc
                : DTOGetInvoicesParamsTypeOrderEnum.DTODesc;
        url.searchParams.append('field_order', sortByColumn);
        url.searchParams.append('type_order', sortOrder);

        if (this.pagination.filter.status?.length) {
            this.pagination.filter.status.forEach(i => {
                url.searchParams.append('filter_status', mapInvoiceStatusToInvoiceDTOStatus[i]);
            });
        }

        if (this.pagination.filter.currency?.length) {
            this.pagination.filter.currency.forEach(i => {
                url.searchParams.append('filter_currency', mapInvoiceCurrencyToDTOCurrency[i]);
            });
        }

        if (this.pagination.filter.overpayment) {
            url.searchParams.append('overpayment', true.toString());
        }

        const period = preriodToDTO(this.pagination.filter.period);
        if (period) {
            url.searchParams.append('start', period.start.toString());
            url.searchParams.append('end', period.end.toString());
        }

        return url.toString();
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
                ? DTOGetInvoicesParamsTypeOrderEnum.DTOAsc
                : DTOGetInvoicesParamsTypeOrderEnum.DTODesc;

        const period = preriodToDTO(this.pagination.filter.period);

        return apiClient.api.getInvoices({
            app_id: invoicesAppStore.invoicesApp$.value!.id,
            ...(options?.offset !== undefined && { offset: options.offset }),
            limit: options?.pageSize || this.pageSize,
            ...(searchId && { search_id: searchId }),
            field_order: sortByColumn,
            type_order: sortOrder,
            filter_status: filterByStatus,
            ...(this.pagination.filter.overpayment && { overpayment: true }),
            ...period
        });
    }

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const result = await apiClient.api.createInvoicesInvoice(
                {
                    amount: form.amount.stringWeiAmount,
                    description: form.description,
                    life_time: form.lifeTimeSeconds,
                    currency: convertCryptoCurrencyToDTOCryptoCurrency(form.currency)
                },
                {
                    app_id: invoicesAppStore.invoicesApp$.value!.id
                }
            );

            await this.updateCurrentListSilently({ silently: true });

            return mapInvoiceDTOToInvoice(result.data);
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

    toggleFilterByCurrency = (currency: InvoiceCurrency): void => {
        const filter = this.pagination.filter;
        const filterCurrency = filter.currency || [];
        const statusActive = filterCurrency.includes(currency);

        filter.currency = statusActive
            ? filterCurrency.filter(i => i !== currency)
            : filterCurrency.concat(currency);
    };

    setFilterByPeriod = (value: InvoiceTableFiltration['period']): void => {
        this.pagination.filter.period = value;
    };

    clearFilterByPeriod = (): void => {
        this.pagination.filter.period = undefined;
    };

    toggleFilterByOverpayment = (): void => {
        this.pagination.filter.overpayment = !this.pagination.filter.overpayment;
    };

    clearFilterByStatus = (): void => {
        this.pagination.filter.status = undefined;
    };

    clearFilterByCurrency = (): void => {
        this.pagination.filter.currency = undefined;
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

const mapInvoiceDTOCurrencyToInvoiceCurrency: Record<
    DTOInvoicesInvoice['currency'],
    InvoiceCurrency
> = {
    [DTOCryptoCurrency.DTO_TON]: CRYPTO_CURRENCY.TON,
    [DTOCryptoCurrency.DTO_USDT]: CRYPTO_CURRENCY.USDT
};

const mapInvoiceCurrencyToDTOCurrency: Record<InvoiceCurrency, DTOInvoicesInvoice['currency']> =
    Object.fromEntries(
        Object.entries(mapInvoiceDTOCurrencyToInvoiceCurrency).map(a => a.reverse())
    );

function mapInvoiceDTOToInvoice(invoiceDTO: DTOInvoicesInvoice): Invoice {
    const commonInvoice: InvoiceCommon = {
        amount: getTokenCurrencyAmountFromDTO(invoiceDTO.amount, invoiceDTO.currency),
        creationDate: new Date(invoiceDTO.date_create * 1000),
        id: invoiceDTO.id,
        currency: convertDTOCryptoCurrencyToCryptoCurrency(invoiceDTO.currency),
        validUntil: new Date(invoiceDTO.date_expire * 1000),
        description: invoiceDTO.description,
        payTo: TonAddress.parse(invoiceDTO.pay_to_address),
        paymentLink: invoiceDTO.payment_link,
        overpayment:
            invoiceDTO.overpayment && Number(invoiceDTO.overpayment) !== 0
                ? getTokenCurrencyAmountFromDTO(invoiceDTO.overpayment, invoiceDTO.currency)
                : undefined
    };

    const status = mapInvoiceDTOStatusToInvoiceStatus[invoiceDTO.status];

    if (status === 'success') {
        return {
            ...commonInvoice,
            paidBy: TonAddress.parse(invoiceDTO.paid_by_address!),
            paymentDate: new Date(invoiceDTO.date_change * 1000),
            status
        };
    }

    if (status === 'cancelled') {
        return {
            ...commonInvoice,
            status,
            cancellationDate: new Date(invoiceDTO.date_change * 1000)
        };
    }

    return { ...commonInvoice, status };
}

const mapSortColumnToFieldOrder: Record<InvoiceTableSortColumn, DTOInvoiceFieldOrder> = {
    id: DTOInvoiceFieldOrder.DTOId,
    description: DTOInvoiceFieldOrder.DTODescription,
    amount: DTOInvoiceFieldOrder.DTOAmount,
    status: DTOInvoiceFieldOrder.DTOStatus,
    'creation-date': DTOInvoiceFieldOrder.DTODateCreate
};

const preriodToDTO = (
    savedPeriod: InvoiceTableFiltration['period']
): { start: number; end: number } | undefined => {
    if (!savedPeriod) {
        return undefined;
    }

    if (isCustomFiltrationPeriod(savedPeriod)) {
        const end = new Date(savedPeriod.to);
        end.setDate(end.getDate() + 1); // savedPeriod.to is inclusive

        return {
            start: savedPeriod.from.getTime() / 1000,
            end: end.getTime() / 1000
        };
    } else {
        const monthIndex = monthsNames.indexOf(savedPeriod.month);
        return {
            start: new Date(savedPeriod.year, monthIndex, 1).getTime() / 1000,
            end: new Date(savedPeriod.year, monthIndex + 1, 1).getTime() / 1000
        };
    }
};

export const invoicesTableStore = new InvoicesTableStore();
