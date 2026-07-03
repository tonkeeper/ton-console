import {
  DTOCryptoCurrency,
  DTOGetInvoicesParamsTypeOrderEnum,
  DTOInvoiceFieldOrder,
  DTOInvoiceStatus,
} from "@/api/api.generated"

export type CreateInvoiceValues = {
  amount: string
  currency: DTOCryptoCurrency
  lifeTimeMinutes: string
  description: string
}

export type CreateInvoiceErrors = Partial<
  Record<keyof CreateInvoiceValues, string>
>

export type InvoicesAppValues = {
  name: string
  description: string
  recipientAddress: string
}

export type InvoicesAppErrors = Partial<Record<keyof InvoicesAppValues, string>>

export type InvoiceWebhookValues = {
  webhook: string
}

export type InvoiceWebhookErrors = Partial<
  Record<keyof InvoiceWebhookValues, string>
>

export type InvoicesListFilters = {
  searchId: string
  status: "all" | DTOInvoiceStatus
  currency: "all" | DTOCryptoCurrency
  period: { from: Date; to: Date } | null
  overpayment: boolean
}

export type InvoicesListSort = {
  field: DTOInvoiceFieldOrder
  direction: DTOGetInvoicesParamsTypeOrderEnum
}

export type InvoicesListPagination = {
  page: number
  pageSize: number
}
