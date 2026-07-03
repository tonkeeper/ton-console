import { Address } from "@ton/core"

import {
  DTOCryptoCurrency,
  DTOInvoiceStatus,
  type DTOInvoicesInvoice,
} from "@/api/api.generated"

export function formatInvoiceAmount(
  amount: string | number | undefined,
  currency: DTOCryptoCurrency
) {
  const numeric = typeof amount === "number" ? amount : Number(amount ?? 0)
  const divisor =
    currency === DTOCryptoCurrency.DTO_TON ? 1_000_000_000 : 1_000_000
  const value = numeric / divisor

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: currency === DTOCryptoCurrency.DTO_TON ? 4 : 2,
  }).format(value)
}

export function formatInvoiceCurrency(currency: DTOCryptoCurrency) {
  return currency === DTOCryptoCurrency.DTO_TON ? "GRAM" : currency
}

export function amountToUnits(amount: string, currency: DTOCryptoCurrency) {
  const value = Number(amount)
  const decimals = currency === DTOCryptoCurrency.DTO_TON ? 9 : 6

  return Math.round(value * 10 ** decimals).toString()
}

export function formatDateTime(timestamp: number | undefined) {
  if (!timestamp) {
    return "-"
  }

  const date = timestampToDate(timestamp)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date)
}

export function timestampToDate(timestamp: number) {
  return new Date(timestamp > 9_999_999_999 ? timestamp : timestamp * 1000)
}

export function formatAddress(address: string | undefined) {
  if (!address) {
    return "-"
  }

  const friendlyAddress = formatTonAddressNonBounceable(address)

  if (friendlyAddress.length <= 18) {
    return friendlyAddress
  }

  return `${friendlyAddress.slice(0, 8)}...${friendlyAddress.slice(-8)}`
}

export function formatTonAddressNonBounceable(address: string) {
  try {
    return Address.parse(address).toString({
      bounceable: false,
      urlSafe: true,
    })
  } catch {
    return address
  }
}

export function getInvoiceStatusLabel(status: DTOInvoiceStatus) {
  switch (status) {
    case DTOInvoiceStatus.DTOPending:
      return "Pending"
    case DTOInvoiceStatus.DTOPaid:
      return "Paid"
    case DTOInvoiceStatus.DTOCancelled:
      return "Cancelled"
    case DTOInvoiceStatus.DTOExpired:
      return "Expired"
    default:
      return status
  }
}

export function canCancelInvoice(invoice: DTOInvoicesInvoice) {
  return invoice.status === DTOInvoiceStatus.DTOPending
}

export function getInvoiceTimeLeftLabel(invoice: DTOInvoicesInvoice) {
  if (invoice.status !== DTOInvoiceStatus.DTOPending || !invoice.date_expire) {
    return null
  }

  const expiresAt = timestampToDate(invoice.date_expire).getTime()
  const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))

  if (secondsLeft === 0) {
    return "Expired"
  }

  const days = Math.floor(secondsLeft / 86_400)
  const hours = Math.floor((secondsLeft % 86_400) / 3_600)
  const minutes = Math.floor((secondsLeft % 3_600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h left`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`
  }

  return `${Math.max(1, minutes)}m left`
}

export function getInvoiceStatusMeta(invoice: DTOInvoicesInvoice) {
  switch (invoice.status) {
    case DTOInvoiceStatus.DTOPaid:
      return `Paid ${formatDateTime(invoice.date_change)}`
    case DTOInvoiceStatus.DTOCancelled:
      return `Cancelled ${formatDateTime(invoice.date_change)}`
    case DTOInvoiceStatus.DTOExpired:
      return `Expired ${formatDateTime(invoice.date_expire)}`
    case DTOInvoiceStatus.DTOPending:
      return getInvoiceTimeLeftLabel(invoice)
    default:
      return null
  }
}

export function getInvoiceErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Try again."
}
