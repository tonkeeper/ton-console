import { Address } from "@ton/core"

import { RTWebhookListStatusEnum } from "@/api/webhooks.generated"

import type { WebhookNetwork } from "./webhook-types"

export const webhookNetworks = ["mainnet", "testnet"] as const
export const WEBHOOKS_DOCUMENTATION_URL =
  "https://docs.tonconsole.com/tonapi/webhooks-api"

export type WebhookStatsPeriod = "last_6h" | "last_24h" | "last_7d"

export const webhookStatsPeriods: {
  value: WebhookStatsPeriod
  label: string
  durationSeconds: number
  stepSeconds: number
}[] = [
  {
    value: "last_6h",
    label: "6 hours",
    durationSeconds: 6 * 60 * 60,
    stepSeconds: 10 * 60,
  },
  {
    value: "last_24h",
    label: "24 hours",
    durationSeconds: 24 * 60 * 60,
    stepSeconds: 60 * 60,
  },
  {
    value: "last_7d",
    label: "7 days",
    durationSeconds: 7 * 24 * 60 * 60,
    stepSeconds: 6 * 60 * 60,
  },
]

export function getStoredWebhookNetwork(): WebhookNetwork {
  if (typeof window === "undefined") {
    return "mainnet"
  }

  const params = new URLSearchParams(window.location.search)
  const queryNetwork = params.get("network")
  if (isWebhookNetwork(queryNetwork)) {
    return queryNetwork
  }

  const stored = window.localStorage.getItem("ton-console:webhooks-network")
  return isWebhookNetwork(stored) ? stored : "mainnet"
}

export function storeWebhookNetwork(network: WebhookNetwork) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem("ton-console:webhooks-network", network)
}

export function isWebhookNetwork(value: unknown): value is WebhookNetwork {
  return value === "mainnet" || value === "testnet"
}

export function getWebhookStatusLabel(status: RTWebhookListStatusEnum) {
  switch (status) {
    case RTWebhookListStatusEnum.RTOnline:
      return "Online"
    case RTWebhookListStatusEnum.RTOffline:
      return "Offline"
    case RTWebhookListStatusEnum.RTSuspended:
      return "Suspended"
  }
}

export function getWebhookStatusBadgeVariant(status: RTWebhookListStatusEnum) {
  switch (status) {
    case RTWebhookListStatusEnum.RTOnline:
      return "default"
    case RTWebhookListStatusEnum.RTOffline:
      return "secondary"
    case RTWebhookListStatusEnum.RTSuspended:
      return "destructive"
  }
}

export function getWebhookStatusBadgeClassName(
  status: RTWebhookListStatusEnum
) {
  switch (status) {
    case RTWebhookListStatusEnum.RTOnline:
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-500"
    case RTWebhookListStatusEnum.RTOffline:
    case RTWebhookListStatusEnum.RTSuspended:
      return "border-destructive/20 bg-destructive/15 text-destructive"
  }
}

export function formatDateTime(value?: string | number | Date | null) {
  if (!value) {
    return "-"
  }

  const date =
    typeof value === "number" ? new Date(value * 1000) : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Try refreshing the page."
) {
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

export function isUnavailableError(error: unknown) {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return false
  }

  return (error as { status?: number }).status === 501
}

export function normalizeEndpoint(value: string) {
  return value.trim()
}

export function validateEndpoint(value: string) {
  const endpoint = normalizeEndpoint(value)

  if (!endpoint) {
    return "Endpoint is required."
  }

  try {
    const url = new URL(endpoint)
    if (url.protocol !== "https:") {
      return "Use an HTTPS endpoint."
    }
  } catch {
    return "Enter a valid URL."
  }

  return null
}

export function parseAccountList(value: string, network?: WebhookNetwork) {
  const rawAccounts = value
    .split(/[,\n]/)
    .map((account) => account.trim())
    .filter(Boolean)

  const uniqueAccounts = Array.from(new Set(rawAccounts))
  if (uniqueAccounts.length === 0) {
    throw new Error("Enter at least one account address.")
  }

  return uniqueAccounts.map((account) => {
    validateAddressNetwork(account, network)
    return Address.parse(account).toRawString()
  })
}

export function formatWebhookAccountAddress(
  account: string,
  network?: WebhookNetwork
) {
  try {
    return Address.parse(account).toString({
      bounceable: true,
      testOnly: network === "testnet",
      urlSafe: true,
    })
  } catch {
    return account
  }
}

export function validateAccountList(value: string, network?: WebhookNetwork) {
  try {
    parseAccountList(value, network)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid account address."
  }
}

export function normalizeOpcode(value: string) {
  return value.trim()
}

export function validateOpcode(value: string) {
  const opcode = normalizeOpcode(value)

  if (!opcode) {
    return "Opcode is required."
  }

  if (!/^(0x[0-9a-fA-F]+|\d+)$/.test(opcode)) {
    return "Use a decimal opcode or 0x-prefixed hex opcode."
  }

  return null
}

export function getWebhookStatsRange(period: WebhookStatsPeriod) {
  const config =
    webhookStatsPeriods.find((item) => item.value === period) ??
    webhookStatsPeriods[0]
  const end = Math.floor(Date.now() / 1000)

  return {
    start: end - config.durationSeconds,
    end,
    step: config.stepSeconds,
  }
}

export function mapWebhookStatsToChartPoints(
  stats: unknown,
  type: "delivered" | "failed"
) {
  if (!stats || typeof stats !== "object" || !("result" in stats)) {
    return []
  }

  const result = (stats as { result?: unknown }).result
  if (!Array.isArray(result)) {
    return []
  }

  return result
    .filter((item) => {
      if (!item || typeof item !== "object") {
        return false
      }

      const metric = (item as { metric?: Record<string, unknown> }).metric
      return metric?.type === type
    })
    .flatMap((item) => {
      const values = (item as { values?: unknown }).values
      if (!Array.isArray(values)) {
        return []
      }

      return values
        .filter((point): point is [number, string | number | null] =>
          Array.isArray(point)
        )
        .map(([timestamp, value]) => ({
          timestamp: timestamp * 1000,
          value: value == null ? 0 : Number(value),
        }))
        .filter((point) => Number.isFinite(point.value))
    })
}

function validateAddressNetwork(address: string, network?: WebhookNetwork) {
  if (!network || !Address.isFriendly(address)) {
    return
  }

  const { isTestOnly } = Address.parseFriendly(address)
  if (isTestOnly && network === "mainnet") {
    throw new Error("This is a testnet address, but you are on mainnet.")
  }

  if (!isTestOnly && network === "testnet") {
    throw new Error("This is a mainnet address, but you are on testnet.")
  }
}
