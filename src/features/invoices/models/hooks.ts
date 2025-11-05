import { useState, useCallback, useMemo } from 'react';
import {
    useInvoicesAppQuery,
    useInvoicesAppTokenQuery,
    useInvoicesStatisticsQuery,
    useInvoicesListQuery,
    useCreateInvoicesAppMutation,
    useEditInvoicesAppMutation,
    useRegenerateTokenMutation,
    useAddWebhookMutation,
    useDeleteInvoicesWebhookMutation,
    useCreateInvoiceMutation,
    useCancelInvoiceMutation
} from './queries';
import type {
    InvoiceTableFiltration,
    InvoiceTableSort,
    InvoiceStatus,
    InvoiceCurrency,
    InvoiceForm
} from './interfaces';

const DEFAULT_PAGE_SIZE = 30;

const DEFAULT_SORT: InvoiceTableSort = {
    column: 'date_create',
    direction: 'desc'
};

const DEFAULT_FILTER: InvoiceTableFiltration = {
    overpayment: false
};

/**
 * Hook to manage invoices app data and operations
 * Combines app query, token query, statistics query, and all mutations
 */
export function useInvoicesApp() {
    const appQuery = useInvoicesAppQuery();
    const appId = appQuery.data?.id;

    const tokenQuery = useInvoicesAppTokenQuery(appId);
    const statisticsQuery = useInvoicesStatisticsQuery(appId);

    const createAppMutation = useCreateInvoicesAppMutation();
    const editAppMutation = useEditInvoicesAppMutation();
    const regenerateTokenMutation = useRegenerateTokenMutation(appId);
    const addWebhookMutation = useAddWebhookMutation(appId);
    const deleteWebhookMutation = useDeleteInvoicesWebhookMutation(appId);

    return {
        // Queries
        app: appQuery.data,
        isAppLoading: appQuery.isLoading,
        isAppError: appQuery.isError,

        token: tokenQuery.data,
        isTokenLoading: tokenQuery.isLoading,
        isTokenError: tokenQuery.isError,

        statistics: statisticsQuery.data,
        isStatisticsLoading: statisticsQuery.isLoading,
        isStatisticsError: statisticsQuery.isError,

        // Mutations
        createApp: createAppMutation.mutate,
        isCreatingApp: createAppMutation.isPending,

        editApp: editAppMutation.mutate,
        isEditingApp: editAppMutation.isPending,

        regenerateToken: regenerateTokenMutation.mutate,
        isRegeneratingToken: regenerateTokenMutation.isPending,

        addWebhook: addWebhookMutation.mutate,
        isAddingWebhook: addWebhookMutation.isPending,

        deleteWebhook: deleteWebhookMutation.mutate,
        isDeletingWebhook: deleteWebhookMutation.isPending,

        // Refetch
        refetchStatistics: statisticsQuery.refetch
    };
}

/**
 * Hook to manage invoices table state (filters, sorting, pagination)
 * Only manages local state, doesn't fetch data
 */
export function useInvoicesTableState() {
    const [filter, setFilter] = useState<InvoiceTableFiltration>(DEFAULT_FILTER);
    const [sort, setSort] = useState<InvoiceTableSort>(DEFAULT_SORT);

    const setFilterById = useCallback((id: string | undefined) => {
        setFilter(prev => ({ ...prev, id }));
    }, []);

    const toggleFilterByStatus = useCallback((status: InvoiceStatus) => {
        setFilter(prev => {
            const statuses = prev.status || [];
            const index = statuses.indexOf(status);
            if (index > -1) {
                return {
                    ...prev,
                    status: statuses.filter((_, i) => i !== index)
                };
            } else {
                return {
                    ...prev,
                    status: [...statuses, status]
                };
            }
        });
    }, []);

    const clearFilterByStatus = useCallback(() => {
        setFilter(prev => ({ ...prev, status: undefined }));
    }, []);

    const toggleFilterByCurrency = useCallback((currency: InvoiceCurrency) => {
        setFilter(prev => {
            const currencies = prev.currency || [];
            const index = currencies.indexOf(currency);
            if (index > -1) {
                return {
                    ...prev,
                    currency: currencies.filter((_, i) => i !== index)
                };
            } else {
                return {
                    ...prev,
                    currency: [...currencies, currency]
                };
            }
        });
    }, []);

    const clearFilterByCurrency = useCallback(() => {
        setFilter(prev => ({ ...prev, currency: undefined }));
    }, []);

    const setFilterByPeriod = useCallback(
        (period: InvoiceTableFiltration['period'] | undefined) => {
            setFilter(prev => ({ ...prev, period }));
        },
        []
    );

    const clearFilterByPeriod = useCallback(() => {
        setFilter(prev => ({ ...prev, period: undefined }));
    }, []);

    const toggleFilterByOverpayment = useCallback(() => {
        setFilter(prev => ({ ...prev, overpayment: !prev.overpayment }));
    }, []);

    const setSortColumn = useCallback((column: InvoiceTableSort['column']) => {
        setSort(prev => ({ ...prev, column }));
    }, []);

    const toggleSortDirection = useCallback(() => {
        setSort(prev => ({
            ...prev,
            direction: prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilter(DEFAULT_FILTER);
        setSort(DEFAULT_SORT);
    }, []);

    const isFilterEmpty = useMemo(() => {
        return (
            (!filter.status || filter.status.length === 0) &&
            (!filter.currency || filter.currency.length === 0) &&
            !filter.id &&
            !filter.period &&
            !filter.overpayment
        );
    }, [filter]);

    return {
        filter,
        sort,
        isFilterEmpty,

        // Filter setters
        setFilterById,
        toggleFilterByStatus,
        clearFilterByStatus,
        toggleFilterByCurrency,
        clearFilterByCurrency,
        setFilterByPeriod,
        clearFilterByPeriod,
        toggleFilterByOverpayment,

        // Sort setters
        setSortColumn,
        toggleSortDirection,

        // Clear all
        clearFilters
    };
}

/**
 * Hook to manage invoices list with infinite scroll
 * Combines pagination state, list query, and mutations
 */
export function useInvoicesList(appId: number | null | undefined) {
    const tableState = useInvoicesTableState();
    const [offset, setOffset] = useState(0);

    const listQuery = useInvoicesListQuery(appId, {
        offset,
        pageSize: DEFAULT_PAGE_SIZE,
        filter: tableState.filter,
        sort: tableState.sort
    });

    const createInvoiceMutation = useCreateInvoiceMutation(appId);
    const cancelInvoiceMutation = useCancelInvoiceMutation(appId);

    // Reset offset when filters or sort change
    const invoices = listQuery.data?.items || [];
    const totalCount = listQuery.data?.totalCount || 0;

    const hasNextPage = invoices.length < totalCount;

    const loadMore = useCallback(() => {
        if (!hasNextPage) return;
        setOffset(prev => prev + DEFAULT_PAGE_SIZE);
    }, [hasNextPage]);

    const refetch = useCallback(() => {
        setOffset(0);
        listQuery.refetch();
    }, [listQuery]);

    const createInvoice = useCallback(
        (form: InvoiceForm) => {
            return createInvoiceMutation.mutate(form);
        },
        [createInvoiceMutation]
    );

    const cancelInvoice = useCallback(
        (invoiceId: string) => {
            return cancelInvoiceMutation.mutate(invoiceId);
        },
        [cancelInvoiceMutation]
    );

    return {
        // Data
        invoices,
        totalCount,
        hasNextPage,

        // Loading states
        isLoading: listQuery.isLoading,
        isLoadingMore: listQuery.isLoading && offset > 0,

        // Pagination
        loadMore,
        refetch,

        // Mutations
        createInvoice,
        isCreatingInvoice: createInvoiceMutation.isPending,
        cancelInvoice,
        isCancelingInvoice: cancelInvoiceMutation.isPending,

        // Table state
        filter: tableState.filter,
        sort: tableState.sort,
        isFilterEmpty: tableState.isFilterEmpty,

        // Filter setters
        setFilterById: tableState.setFilterById,
        toggleFilterByStatus: tableState.toggleFilterByStatus,
        clearFilterByStatus: tableState.clearFilterByStatus,
        toggleFilterByCurrency: tableState.toggleFilterByCurrency,
        clearFilterByCurrency: tableState.clearFilterByCurrency,
        setFilterByPeriod: tableState.setFilterByPeriod,
        clearFilterByPeriod: tableState.clearFilterByPeriod,
        toggleFilterByOverpayment: tableState.toggleFilterByOverpayment,

        // Sort setters
        setSortColumn: tableState.setSortColumn,
        toggleSortDirection: tableState.toggleSortDirection,

        // Clear all
        clearFilters: tableState.clearFilters
    };
}
