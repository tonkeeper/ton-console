import { Address } from "@ton/core"

const nanoPerTon = 1_000_000_000

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

export function isTonAddress(value: string) {
  try {
    normalizeTonAddress(value)
    return true
  } catch {
    return false
  }
}

export function formatTonAmount(nanoValue: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 4,
  }).format(nanoValue / nanoPerTon)
}

export function formatUsdAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value)
}

export function parseTonToNano(value: string) {
  const trimmed = value.trim()

  if (!/^\d+(\.\d{1,9})?$/.test(trimmed)) {
    return null
  }

  const [whole, fractional = ""] = trimmed.split(".")
  const nano =
    BigInt(whole) * BigInt(nanoPerTon) + BigInt(fractional.padEnd(9, "0"))

  if (nano > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null
  }

  return Number(nano)
}

export function getTestnetExplorerTransactionUrl(hash: string) {
  return `https://testnet.tonviewer.com/transaction/${encodeURIComponent(hash)}`
}

export async function resolveTestnetTransactionHash(messageHash: string) {
  const token = import.meta.env.VITE_TONAPI_TOKEN

  for (let attempt = 0; attempt <= 20; attempt += 1) {
    const response = await fetch(
      `https://testnet.tonapi.io/v2/blockchain/messages/${encodeURIComponent(
        messageHash
      )}/transaction`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    )

    if (response.ok) {
      const data = (await response.json()) as { hash?: unknown }
      if (typeof data.hash === "string" && data.hash.length > 0) {
        return data.hash
      }
    }

    if (response.status !== 404 || attempt === 20) {
      throw new Error("Transaction was not found on testnet.")
    }

    await sleep(1500)
  }

  throw new Error("Transaction was not found on testnet.")
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
