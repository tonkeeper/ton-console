import { Address } from "@ton/core"

export function getApiErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const responseError = (error as { error?: unknown }).error

    if (
      responseError &&
      typeof responseError === "object" &&
      "error" in responseError
    ) {
      const message = (responseError as { error?: unknown }).error
      if (typeof message === "string" && message.length > 0) {
        return message
      }
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Try refreshing the page."
}

export function normalizeTonAddress(value: string) {
  return Address.parse(value.trim()).toRawString()
}

export function formatTonAddressBounceable(value: string) {
  try {
    return Address.parse(value).toString({
      bounceable: true,
      testOnly: false,
      urlSafe: true,
    })
  } catch {
    return value
  }
}

export function isTonAddress(value: string) {
  try {
    normalizeTonAddress(value)
    return true
  } catch {
    return false
  }
}

export function formatUsdAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined).format(value)
}

export function getExplorerAccountUrl(account: string) {
  return `https://tonviewer.com/${encodeURIComponent(account)}`
}
