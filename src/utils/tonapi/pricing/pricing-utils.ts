export function getApiErrorMessage(error: unknown, fallback = "Try refreshing the page.") {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function formatUsd(value: number) {
  if (value === 0) {
    return "$0"
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateTime(value: number | undefined) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
