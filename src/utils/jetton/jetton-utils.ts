import { Address } from "@ton/core"

export function getJettonErrorMessage(error: unknown) {
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

export function normalizeTonAddressToAddress(value: string) {
  return Address.parse(value.trim())
}

export function isTonAddress(value: string) {
  try {
    normalizeTonAddress(value)
    return true
  } catch {
    return false
  }
}

export function formatTonAddressBounceable(value: string) {
  return formatTonAddress(value, true)
}

export function formatTonAddressNonBounceable(value: string) {
  return formatTonAddress(value, false)
}

function formatTonAddress(value: string, bounceable: boolean) {
  try {
    return Address.parse(value.trim()).toString({
      bounceable,
      testOnly: false,
      urlSafe: true,
    })
  } catch {
    return value
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
