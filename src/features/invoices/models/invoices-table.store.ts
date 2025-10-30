import { makeAutoObservable, reaction } from 'mobx';
import {
    createImmediateReaction,
    CRYPTO_CURRENCY,
    Loadable,
    monthsNames,
    TonAddress
} from 'src/shared';
import {
    getInvoices,
    createInvoicesInvoice,
    cancelInvoicesInvoice,
    DTOCryptoCurrency,
    DTOInvoiceFieldOrder,
    DTOInvoicesInvoice,
    GetInvoicesData,
    GetInvoicesResponse,
    DTOInvoiceStatus
} from 'src/shared/api';
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
import type { InvoicesAppStore } from './invoices-app.store';
import {
    convertCryptoCurrencyToDTOCryptoCurrency,
    convertDTOCryptoCurrencyToCryptoCurrency,
    getTokenCurrencyAmountFromDTO
} from './utils';

export const apiClientBaseURL = import.meta.env.VITE_BASE_URL;
export const backendBaseURL =
    apiClientBaseURL === '/' ? import.meta.env.VITE_BASE_PROXY_URL : apiClientBaseURL;
export class InvoicesTableStore {
    invoices$ = new Loadable<Invoice[]>([]);

    private readonly invoicesAppStore: InvoicesAppStore;

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

    private disposeAppReaction?: () => void;

    private disposePaginationReaction?: () => void;

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
        const appId = this.invoicesAppStore.invoicesApp$.value?.id;
        if (!appId) {
            throw new Error('Invoices app is not loaded');
        }

        const path = '/api/v1/services/invoices/export';
        const url = new URL(path, backendBaseURL);
        url.searchParams.append('app_id', appId.toString());

        if (this.pagination.filter.id !== undefined) {
            url.searchParams.append('search_id', this.pagination.filter.id);
        }
        const sortByColumn = mapSortColumnToFieldOrder[this.pagination.sort.column];
        const sortOrder: GetInvoicesData['query']['type_order'] =
            this.pagination.sort.direction === 'asc' ? 'asc' : 'desc';
        url.searchParams.append('field_order', sortByColumn);
        url.searchParams.append('type_order', sortOrder);

        if (this.pagination.filter.status?.length) {
            this.pagination.filter.status.forEach(i => {
                url.searchParams.append('filter_status', mapInvoiceStatusToInvoiceDTOStatus[i]);
            });
        }

        if (this.pagination.filter.currency?.length) {
            this.pagination.filter.currency.forEach(i => {
                url.searchParams.append('currency', mapInvoiceCurrencyToDTOCurrency[i]);
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

    constructor({ invoicesAppStore }: { invoicesAppStore: InvoicesAppStore }) {
        makeAutoObservable(this);
        this.invoicesAppStore = invoicesAppStore;

        let disposePagination: (() => void) | undefined;

        this.disposeAppReaction = createImmediateReaction(
            () => this.invoicesAppStore.invoicesApp$.value,
            app => {
                disposePagination?.();
                this.clearState();
                this.loadFirstPageWithNewParams.cancelAllPendingCalls();
                this.loadNextPage.cancelAllPendingCalls();

                if (app) {
                    this.loadFirstPageWithNewParams();

                    disposePagination = reaction(
                        () => JSON.stringify(this.pagination),
                        () => {
                            this.loadFirstPageWithNewParams({ cancelPreviousCall: true });
                        }
                    );
                    this.disposePaginationReaction = disposePagination;
                }
            }
        );
    }

    dispose(): void {
        this.disposeAppReaction?.();
        this.disposePaginationReaction?.();
    }

    isItemLoaded = (index: number): boolean =>
        !this.hasNextPage || index < this.invoices$.value.length;

    loadFirstPageWithNewParams = this.invoices$.createAsyncAction(
        async () => {
            this.loadNextPage.cancelAllPendingCalls();

            const data = await this.fetchInvoices();
            const invoices = data.items.map(mapInvoiceDTOToInvoice);

            this.totalInvoices = data.count;
            return invoices;
        },
        { resetBeforeExecution: true }
    );

    loadNextPage = this.invoices$.createAsyncAction(async () => {
        const data = await this.fetchInvoices({ offset: this.invoices$.value.length });
        const invoices = data.items.map(mapInvoiceDTOToInvoice);

        this.totalInvoices = data.count;
        return this.invoices$.value.concat(invoices);
    });

    updateCurrentListSilently = this.invoices$.createAsyncAction(async () => {
        const data = await this.fetchInvoices();
        const invoices = data.items.map(mapInvoiceDTOToInvoice);

        this.totalInvoices = data.count;
        return invoices;
    });

    private async fetchInvoices(options?: {
        offset?: number;
        pageSize?: number;
    }): Promise<GetInvoicesResponse> {
        const appId = this.invoicesAppStore.invoicesApp$.value?.id;
        if (!appId) {
            throw new Error('Invoices app is not loaded');
        }

        const searchId = this.pagination.filter.id;
        let filterByStatus = undefined;

        if (this.pagination.filter.status?.length) {
            filterByStatus = this.pagination.filter.status.map(
                i => mapInvoiceStatusToInvoiceDTOStatus[i]
            );
        }

        const sortByColumn = mapSortColumnToFieldOrder[this.pagination.sort.column];
        const sortOrder: GetInvoicesData['query']['type_order'] =
            this.pagination.sort.direction === 'asc' ? 'asc' : 'desc';

        const period = preriodToDTO(this.pagination.filter.period);

        const { data, error } = await getInvoices({
            query: {
                app_id: appId,
                ...(options?.offset !== undefined && { offset: options.offset }),
                limit: options?.pageSize || this.pageSize,
                ...(searchId && { search_id: searchId }),
                field_order: sortByColumn,
                type_order: sortOrder,
                filter_status: filterByStatus,
                currency:
                    this.pagination.filter.currency?.length === 1
                        ? mapInvoiceCurrencyToDTOCurrency[this.pagination.filter.currency[0]]
                        : undefined,
                ...(this.pagination.filter.overpayment && { overpayment: true }),
                ...period
            }
        });

        if (error || !data) throw error;

        return data;
    }

    createInvoice = this.invoices$.createAsyncAction(
        async (form: InvoiceForm) => {
            const appId = this.invoicesAppStore.invoicesApp$.value?.id;
            if (!appId) {
                throw new Error('Invoices app is not loaded');
            }

            const { data, error } = await createInvoicesInvoice({
                query: {
                    app_id: appId
                },
                body: {
                    amount: form.amount.stringWeiAmount,
                    description: form.description,
                    life_time: form.lifeTimeSeconds,
                    currency: convertCryptoCurrencyToDTOCryptoCurrency(form.currency)
                }
            });

            if (error || !data) {
                throw error;
            }

            await this.updateCurrentListSilently({ silently: true });

            return mapInvoiceDTOToInvoice(data);
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
            const appId = this.invoicesAppStore.invoicesApp$.value?.id;
            if (!appId) {
                throw new Error('Invoices app is not loaded');
            }

            const { error } = await cancelInvoicesInvoice({
                path: { id },
                query: { app_id: appId }
            });

            if (error) throw error;

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

const mapInvoiceDTOStatusToInvoiceStatus: Record<DTOInvoiceStatus, InvoiceStatus> = {
    [DTOInvoiceStatus.PAID]: 'success',
    [DTOInvoiceStatus.PENDING]: 'pending',
    [DTOInvoiceStatus.EXPIRED]: 'expired',
    [DTOInvoiceStatus.CANCELLED]: 'cancelled'
};

const mapInvoiceStatusToInvoiceDTOStatus: Record<InvoiceStatus, DTOInvoiceStatus> =
    Object.fromEntries(Object.entries(mapInvoiceDTOStatusToInvoiceStatus).map(a => a.reverse()));

const mapInvoiceDTOCurrencyToInvoiceCurrency: Record<DTOCryptoCurrency, InvoiceCurrency> = {
    [DTOCryptoCurrency.TON]: CRYPTO_CURRENCY.TON,
    [DTOCryptoCurrency.USDT]: CRYPTO_CURRENCY.USDT
};

const mapInvoiceCurrencyToDTOCurrency: Record<InvoiceCurrency, DTOCryptoCurrency> =
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
    id: DTOInvoiceFieldOrder.ID,
    description: DTOInvoiceFieldOrder.DESCRIPTION,
    amount: DTOInvoiceFieldOrder.AMOUNT,
    status: DTOInvoiceFieldOrder.STATUS,
    'creation-date': DTOInvoiceFieldOrder.DATE_CREATE
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
