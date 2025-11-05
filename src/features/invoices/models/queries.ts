import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStandaloneToast } from '@chakra-ui/react';
import {
    getInvoicesApp,
    createInvoicesApp,
    updateInvoicesApp,
    getInvoicesAppToken,
    regenerateInvoicesAppToken,
    createInvoicesAppWebhook,
    deleteInvoicesAppWebhook,
    getInvoicesStats,
    getInvoices,
    createInvoicesInvoice,
    cancelInvoicesInvoice,
    DTOCryptoCurrency,
    DTOInvoiceFieldOrder,
    GetInvoicesData
} from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { CRYPTO_CURRENCY } from 'src/shared';
import {
    mapInvoicesAppDTOToInvoicesApp,
    mapInvoicesStatsDTOToInvoicesStats,
    mapInvoiceDTOToInvoice
} from './utils';
import type {
    InvoicesProjectForm,
    InvoicesAllStatistics,
    InvoiceForm,
    InvoiceTableFiltration,
    InvoiceTableSort
} from './interfaces';
import { isCustomFiltrationPeriod } from './interfaces';

/**
 * Query key factory for invoices queries
 */
export const invoicesKeys = {
    all: () => ['invoices'] as const,
    app: (projectId: number | null | undefined) =>
        [...invoicesKeys.all(), 'app', projectId] as const,
    token: (appId: number | null | undefined) =>
        [...invoicesKeys.all(), 'token', appId] as const,
    statistics: (appId: number | null | undefined) =>
        [...invoicesKeys.all(), 'statistics', appId] as const,
    list: (appId: number | null | undefined, filters: InvoiceTableFiltration, sort: InvoiceTableSort) =>
        [...invoicesKeys.all(), 'list', appId, filters, sort] as const
};

/**
 * Hook to fetch invoices app data
 * Returns the invoices app for the current project or null if not exists
 */
export function useInvoicesAppQuery() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: invoicesKeys.app(projectId),
        queryFn: async () => {
            if (!projectId) return null;
            const { data, error } = await getInvoicesApp({
                query: { project_id: projectId }
            });
            if (error || !data?.app) return null;
            return mapInvoicesAppDTOToInvoicesApp(data.app);
        },
        enabled: !!projectId,
        staleTime: Infinity, // Never refetch unless explicitly invalidated
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true // Fetch once when component mounts
    });
}

/**
 * Hook to fetch invoices app token
 */
export function useInvoicesAppTokenQuery(appId: number | null | undefined) {
    return useQuery({
        queryKey: invoicesKeys.token(appId),
        queryFn: async () => {
            if (!appId) return null;
            const { data, error } = await getInvoicesAppToken({
                query: { app_id: appId }
            });
            if (error || !data) return null;
            return data.token;
        },
        enabled: !!appId,
        staleTime: Infinity // Token doesn't change until regenerated
    });
}

/**
 * Hook to fetch invoices statistics
 */
export function useInvoicesStatisticsQuery(
    appId: number | null | undefined,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: invoicesKeys.statistics(appId),
        queryFn: async () => {
            if (!appId) return null;

            const [tonResult, usdtResult] = await Promise.all([
                getInvoicesStats({
                    query: {
                        app_id: appId,
                        currency: DTOCryptoCurrency.TON
                    }
                }),
                getInvoicesStats({
                    query: {
                        app_id: appId,
                        currency: DTOCryptoCurrency.USDT
                    }
                })
            ]);

            if (
                tonResult.error ||
                usdtResult.error ||
                !tonResult.data ||
                !usdtResult.data
            ) {
                return null;
            }

            return {
                [CRYPTO_CURRENCY.TON]: mapInvoicesStatsDTOToInvoicesStats(
                    tonResult.data.stats,
                    CRYPTO_CURRENCY.TON
                ),
                [CRYPTO_CURRENCY.USDT]: mapInvoicesStatsDTOToInvoicesStats(
                    usdtResult.data.stats,
                    CRYPTO_CURRENCY.USDT
                )
            } as InvoicesAllStatistics;
        },
        enabled: !!appId && (options?.enabled !== false),
        staleTime: 30 * 1000 // 30 seconds
    });
}

/**
 * Hook to fetch paginated invoices list
 */
export function useInvoicesListQuery(
    appId: number | null | undefined,
    pagination: {
        offset: number;
        pageSize: number;
        filter: InvoiceTableFiltration;
        sort: InvoiceTableSort;
    },
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: invoicesKeys.list(appId, pagination.filter, pagination.sort),
        queryFn: async () => {
            if (!appId) return { items: [], totalCount: 0 };

            const { data, error } = await getInvoices({
                query: {
                    app_id: appId,
                    offset: pagination.offset,
                    limit: pagination.pageSize,
                    ...(pagination.filter.id && { search_id: pagination.filter.id }),
                    ...(pagination.filter.status?.length && {
                        status: pagination.filter.status
                    }),
                    ...(pagination.filter.currency?.length && {
                        currency: pagination.filter.currency.map(c =>
                            c === 'TON'
                                ? DTOCryptoCurrency.TON
                                : DTOCryptoCurrency.USDT
                        )
                    }),
                    field_order: pagination.sort.column as DTOInvoiceFieldOrder,
                    type_order: pagination.sort.direction as GetInvoicesData['query']['type_order'],
                    ...(pagination.filter.period && isCustomFiltrationPeriod(pagination.filter.period) && {
                        created_at_start_date: Math.floor(pagination.filter.period.from.getTime() / 1000),
                        created_at_end_date: Math.floor(pagination.filter.period.to.getTime() / 1000)
                    }),
                    ...(pagination.filter.overpayment && {
                        is_overpayment: true
                    })
                } as GetInvoicesData['query']
            });

            if (error || !data) return { items: [], totalCount: 0 };

            return {
                items: data.items.map(mapInvoiceDTOToInvoice),
                totalCount: data.count
            };
        },
        enabled: !!appId && (options?.enabled !== false)
    });
}

/**
 * Mutation to create invoices app
 */
export function useCreateInvoicesAppMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: InvoicesProjectForm) => {
            // Capture projectId at mutation time
            const currentProjectId = projectId;
            if (!currentProjectId) throw new Error('Project ID is required');

            const { data, error } = await createInvoicesApp({
                query: { project_id: currentProjectId },
                body: {
                    name: form.name,
                    recipient_address: form.receiverAddress.toString()
                }
            });

            if (error || !data?.app) throw error;
            return {
                app: mapInvoicesAppDTOToInvoicesApp(data.app),
                projectId: currentProjectId
            };
        },
        onSuccess: (result) => {
            // Use projectId from mutation result, not from closure
            queryClient.setQueryData(invoicesKeys.app(result.projectId), result.app);
            toast({
                title: 'Invoices app created successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Invoices app creation error',
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to edit invoices app
 */
export function useEditInvoicesAppMutation() {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: { id: number; name?: string; receiverAddress?: { toString(): string } }) => {
            // Capture projectId at mutation time
            const currentProjectId = projectId;

            const { data, error } = await updateInvoicesApp({
                path: { id: form.id },
                body: {
                    ...(form.name && { name: form.name }),
                    ...(form.receiverAddress && { recipient_address: form.receiverAddress.toString() })
                }
            });

            if (error || !data?.app) throw error;
            return {
                app: mapInvoicesAppDTOToInvoicesApp(data.app),
                projectId: currentProjectId
            };
        },
        onSuccess: (result) => {
            // Use projectId from mutation result, not from closure
            if (result.projectId) {
                queryClient.setQueryData(invoicesKeys.app(result.projectId), result.app);
            }
            toast({
                title: 'Invoices app updated successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Invoices app updating error',
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to regenerate token
 */
export function useRegenerateTokenMutation(appId: number | null | undefined) {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async () => {
            if (!appId) throw new Error('App ID is required');

            const { data, error } = await regenerateInvoicesAppToken({
                query: { app_id: appId }
            });

            if (error || !data) throw error;
            return data.token;
        },
        onSuccess: (token) => {
            queryClient.setQueryData(invoicesKeys.token(appId), token);
            toast({
                title: 'Token regenerated successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Token regeneration error',
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to add webhook
 */
export function useAddWebhookMutation(appId: number | null | undefined) {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (webhook: string) => {
            // Capture projectId at mutation time
            const currentProjectId = projectId;
            if (!appId) throw new Error('App ID is required');

            const { data, error } = await createInvoicesAppWebhook({
                path: { id: appId },
                body: { webhook }
            });

            if (error || !data?.app) throw error;
            return {
                app: mapInvoicesAppDTOToInvoicesApp(data.app),
                projectId: currentProjectId
            };
        },
        onSuccess: (result) => {
            // Use projectId from mutation result, not from closure
            if (result.projectId) {
                queryClient.setQueryData(invoicesKeys.app(result.projectId), result.app);
            }
            toast({
                title: 'Webhook added successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: "Webhook wasn't added",
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to delete webhook
 */
export function useDeleteInvoicesWebhookMutation(appId: number | null | undefined) {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (webhookId: string) => {
            // Capture projectId at mutation time
            const currentProjectId = projectId;
            if (!appId) throw new Error('App ID is required');

            const { data, error } = await deleteInvoicesAppWebhook({
                path: { id: appId, webhook_id: webhookId }
            });

            if (error || !data?.app) throw error;
            return {
                app: mapInvoicesAppDTOToInvoicesApp(data.app),
                projectId: currentProjectId
            };
        },
        onSuccess: (result) => {
            // Use projectId from mutation result, not from closure
            if (result.projectId) {
                queryClient.setQueryData(invoicesKeys.app(result.projectId), result.app);
            }
            toast({
                title: 'Webhook deleted successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: "Webhook wasn't deleted",
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to create invoice
 */
export function useCreateInvoiceMutation(appId: number | null | undefined) {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (form: InvoiceForm) => {
            if (!appId) throw new Error('App ID is required');

            const { data, error } = await createInvoicesInvoice({
                query: { app_id: appId },
                body: {
                    amount: form.amount.stringWeiAmount,
                    description: form.description,
                    currency: form.currency === CRYPTO_CURRENCY.TON
                        ? DTOCryptoCurrency.TON
                        : DTOCryptoCurrency.USDT,
                    life_time: form.lifeTimeSeconds
                }
            });

            if (error || !data) throw error;
            return mapInvoiceDTOToInvoice(data);
        },
        onSuccess: () => {
            // Invalidate all invoices lists for this app to trigger refetch
            queryClient.invalidateQueries({
                queryKey: invoicesKeys.all()
            });
            toast({
                title: 'Invoice created successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Invoice creation error',
                status: 'error',
                isClosable: true
            });
        }
    });
}

/**
 * Mutation to cancel invoice
 */
export function useCancelInvoiceMutation(appId: number | null | undefined) {
    const queryClient = useQueryClient();
    const { toast } = createStandaloneToast();

    return useMutation({
        mutationFn: async (invoiceId: string) => {
            if (!appId) throw new Error('App ID is required');

            const { error } = await cancelInvoicesInvoice({
                path: { id: invoiceId },
                query: { app_id: appId }
            });

            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate all invoices lists for this app
            queryClient.invalidateQueries({
                queryKey: invoicesKeys.all()
            });
            toast({
                title: 'Invoice cancelled successfully',
                status: 'success',
                isClosable: true
            });
        },
        onError: () => {
            toast({
                title: 'Invoice cancellation error',
                status: 'error',
                isClosable: true
            });
        }
    });
}
