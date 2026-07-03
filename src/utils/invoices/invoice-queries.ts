import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import {
  DTOCryptoCurrency,
  DTOExportInvoicesCsvParamsTypeOrderEnum,
  DTOGetInvoicesParamsTypeOrderEnum,
  DTOInvoiceFieldOrder,
  type DTOInvoicesApp,
  type DTOInvoicesAppWebhooks,
  type DTOInvoicesInvoice,
} from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

import { amountToUnits } from "./invoice-format"
import type {
  CreateInvoiceValues,
  InvoicesListFilters,
  InvoicesListPagination,
  InvoicesListSort,
  InvoicesAppValues,
  InvoiceWebhookValues,
} from "./invoice-types"

const INVOICES_QUERY_KEY = ["invoices"] as const

export function getInvoicesAppQueryKey(projectId: number | null | undefined) {
  return [...INVOICES_QUERY_KEY, "app", projectId] as const
}

function getInvoicesTokenQueryKey(appId: number | null | undefined) {
  return [...INVOICES_QUERY_KEY, "token", appId] as const
}

function getInvoicesStatsQueryKey(
  appId: number | null | undefined,
  currency: DTOCryptoCurrency
) {
  return [...INVOICES_QUERY_KEY, "stats", appId, currency] as const
}

function getInvoicesListQueryKey(appId: number | null | undefined) {
  return [...INVOICES_QUERY_KEY, "list", appId] as const
}

function getInvoicesListParamsQueryKey(
  appId: number | null | undefined,
  filters: InvoicesListFilters,
  sort: InvoicesListSort,
  pagination: InvoicesListPagination
) {
  return [...INVOICES_QUERY_KEY, "list", appId, filters, sort, pagination] as const
}

export function useInvoicesAppQuery(enabled = true) {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getInvoicesAppQueryKey(projectId),
    enabled: Boolean(projectId) && enabled,
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      try {
        const response = await api.api.getInvoicesApp(
          { project_id: projectId },
          { format: "json" }
        )

        return response.data.app
      } catch (error) {
        if (isNotFoundLikeError(error)) {
          return null
        }

        throw error
      }
    },
  })
}

export function useCreateInvoicesAppMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (values: InvoicesAppValues) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.createInvoicesApp(
        { project_id: projectId },
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          recipient_address: values.recipientAddress.trim(),
        },
        { format: "json" }
      )

      return response.data.app
    },
    onSuccess: (app) => {
      queryClient.setQueryData<DTOInvoicesApp>(
        getInvoicesAppQueryKey(projectId),
        app
      )
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY })
    },
  })
}

export function useUpdateInvoicesAppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      app,
      values,
    }: {
      app: DTOInvoicesApp
      values: InvoicesAppValues
    }) => {
      const response = await api.api.updateInvoicesApp(
        app.id,
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          recipient_address: values.recipientAddress.trim(),
        },
        { format: "json" }
      )

      return response.data.app
    },
    onSuccess: (app) => {
      queryClient.setQueryData<DTOInvoicesApp>(
        getInvoicesAppQueryKey(app.project_id),
        app
      )
      queryClient.invalidateQueries({
        queryKey: getInvoicesAppQueryKey(app.project_id),
      })
    },
  })
}

export function useInvoicesTokenQuery(appId: number | null | undefined) {
  return useQuery({
    queryKey: getInvoicesTokenQueryKey(appId),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.getInvoicesAppToken(
        { app_id: appId },
        { format: "json" }
      )

      return response.data.token
    },
  })
}

export function useRegenerateInvoicesTokenMutation(
  appId: number | null | undefined
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.regenerateInvoicesAppToken(
        { app_id: appId },
        { format: "json" }
      )

      return response.data.token
    },
    onSuccess: (token) => {
      queryClient.setQueryData(getInvoicesTokenQueryKey(appId), token)
    },
  })
}

export function useCreateInvoicesAppWebhookMutation(
  appId: number | null | undefined
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: InvoiceWebhookValues) => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.createInvoicesAppWebhook(
        appId,
        { webhook: values.webhook.trim() },
        { format: "json" }
      )

      return response.data.app
    },
    onSuccess: (app) => {
      queryClient.setQueryData<DTOInvoicesApp>(
        getInvoicesAppQueryKey(app.project_id),
        app
      )
      queryClient.invalidateQueries({
        queryKey: getInvoicesAppQueryKey(app.project_id),
      })
    },
  })
}

export function useUpdateInvoicesAppWebhookMutation(
  appId: number | null | undefined
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      webhook,
      values,
    }: {
      webhook: DTOInvoicesAppWebhooks[number]
      values: InvoiceWebhookValues
    }) => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.updateInvoicesAppWebhook(
        appId,
        webhook.id,
        { webhook: values.webhook.trim() },
        { format: "json" }
      )

      return response.data.app
    },
    onSuccess: (app) => {
      queryClient.setQueryData<DTOInvoicesApp>(
        getInvoicesAppQueryKey(app.project_id),
        app
      )
      queryClient.invalidateQueries({
        queryKey: getInvoicesAppQueryKey(app.project_id),
      })
    },
  })
}

export function useDeleteInvoicesAppWebhookMutation(
  appId: number | null | undefined
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (webhook: DTOInvoicesAppWebhooks[number]) => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.deleteInvoicesAppWebhook(
        appId,
        webhook.id,
        { format: "json" }
      )

      return response.data.app
    },
    onSuccess: (app) => {
      queryClient.setQueryData<DTOInvoicesApp>(
        getInvoicesAppQueryKey(app.project_id),
        app
      )
      queryClient.invalidateQueries({
        queryKey: getInvoicesAppQueryKey(app.project_id),
      })
    },
  })
}

export function useInvoicesStatsQuery(
  appId: number | null | undefined,
  currency: DTOCryptoCurrency
) {
  return useQuery({
    queryKey: getInvoicesStatsQueryKey(appId, currency),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.getInvoicesStats(
        { app_id: appId, currency },
        { format: "json" }
      )

      return response.data.stats
    },
    staleTime: 30 * 1000,
  })
}

export function useInvoicesListQuery(appId: number | null | undefined) {
  return useQuery({
    queryKey: getInvoicesListQueryKey(appId),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.getInvoices(
        {
          app_id: appId,
          limit: 50,
          offset: 0,
          field_order: DTOInvoiceFieldOrder.DTODateCreate,
          type_order: DTOGetInvoicesParamsTypeOrderEnum.DTODesc,
        },
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useFilteredInvoicesListQuery(
  appId: number | null | undefined,
  filters: InvoicesListFilters,
  sort: InvoicesListSort,
  pagination: InvoicesListPagination
) {
  return useQuery({
    queryKey: getInvoicesListParamsQueryKey(appId, filters, sort, pagination),
    enabled: Boolean(appId),
    queryFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.getInvoices(
        getInvoicesListParams(appId, filters, sort, pagination),
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useExportInvoicesCsvMutation(
  appId: number | null | undefined,
  filters: InvoicesListFilters,
  sort: InvoicesListSort
) {
  return useMutation({
    mutationFn: async () => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.exportInvoicesCsv(
        {
          ...getInvoicesListParams(appId, filters, sort),
          type_order:
            sort.direction === DTOGetInvoicesParamsTypeOrderEnum.DTOAsc
              ? DTOExportInvoicesCsvParamsTypeOrderEnum.DTOAsc
              : DTOExportInvoicesCsvParamsTypeOrderEnum.DTODesc,
        },
        {
          format: "blob",
          headers: {
            Accept: "text/csv",
          },
        }
      )

      return response.data
    },
  })
}

export function useInvoiceQuery(
  invoiceId: string | null,
  appId: number | null | undefined
) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, "detail", appId, invoiceId],
    enabled: Boolean(appId && invoiceId),
    queryFn: async () => {
      if (!appId || !invoiceId) {
        throw new Error("Invoice is not selected")
      }

      const response = await api.api.getInvoicesInvoice(
        invoiceId,
        { app_id: appId },
        { format: "json" }
      )

      return response.data
    },
  })
}

export function useCreateInvoiceMutation(appId: number | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateInvoiceValues) => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const currency = values.currency
      const response = await api.api.createInvoicesInvoice(
        {
          amount: amountToUnits(values.amount, currency),
          currency,
          description: values.description.trim() || undefined,
          life_time: Number(values.lifeTimeMinutes) * 60,
        },
        { app_id: appId },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY })
    },
  })
}

export function useCancelInvoiceMutation(appId: number | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (invoice: DTOInvoicesInvoice) => {
      if (!appId) {
        throw new Error("Invoices app is not created")
      }

      const response = await api.api.cancelInvoicesInvoice(
        invoice.id,
        { app_id: appId },
        { format: "json" }
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY })
    },
  })
}

function isNotFoundLikeError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }

  const maybeStatus = error as { status?: number; error?: { code?: number } }
  return maybeStatus.status === 404 || maybeStatus.error?.code === 404
}

function startOfDay(date: Date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function endOfDay(date: Date) {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

function getInvoicesListParams(
  appId: number,
  filters: InvoicesListFilters,
  sort: InvoicesListSort,
  pagination?: InvoicesListPagination
) {
  return {
    app_id: appId,
    limit: pagination?.pageSize,
    offset: pagination ? (pagination.page - 1) * pagination.pageSize : undefined,
    field_order: sort.field,
    type_order: sort.direction,
    search_id: filters.searchId.trim() || undefined,
    filter_status: filters.status === "all" ? undefined : [filters.status],
    currency: filters.currency === "all" ? undefined : filters.currency,
    start: filters.period
      ? Math.floor(startOfDay(filters.period.from).getTime() / 1000)
      : undefined,
    end: filters.period
      ? Math.floor(endOfDay(filters.period.to).getTime() / 1000)
      : undefined,
    overpayment: filters.overpayment || undefined,
  }
}
