import { Cell, fromNano } from "@ton/core"

import type {
  ADAirdropData,
  ADAirdropDataClamStatusEnum,
  ADDistributorData,
  ADDistributorDataAirdropStatusEnum,
  ADInternalMessage,
} from "@/api/airdrop.generated"

export type AirdropSetupStatus =
  | "need_file"
  | "processing"
  | "need_deploy"
  | "claim_active"
  | "claim_stopped"
  | "blocked"

export type AirdropOnChainStatus =
  | "waiting"
  | "deploy"
  | "topup"
  | "ready"
  | "block"
  | "withdraw_jetton"
  | "withdraw_ton"
  | "withdraw_complete"

export type AirdropTonConnectMessage = {
  address: string
  amount: string
  stateInit?: string
  payload?: string
}

export type AirdropTonConnectTransaction = {
  validUntil: number
  messages: AirdropTonConnectMessage[]
}

const WALLET_W5_CODE_HASH = "IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8="

export function getAirdropErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    if ("error" in error) {
      const responseError = (error as { error?: unknown }).error

      if (responseError && typeof responseError === "object") {
        if ("message" in responseError) {
          const message = (responseError as { message?: unknown }).message
          if (typeof message === "string" && message.length > 0) {
            return message
          }
        }

        if ("error" in responseError) {
          const message = (responseError as { error?: unknown }).error
          if (typeof message === "string" && message.length > 0) {
            return message
          }
        }
      }
    }

    if ("message" in error) {
      const message = (error as { message?: unknown }).message
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

export function getAirdropSetupStatus(
  airdrop: ADAirdropData,
  distributors: ADDistributorData[]
): AirdropSetupStatus {
  if (airdrop.upload_error) {
    return "blocked"
  }

  if (airdrop.upload_in_progress) {
    return "processing"
  }

  const onChainStatus = getAirdropOnChainStatus(distributors)

  if (onChainStatus === "waiting") {
    return hasUploadedAirdropFile(airdrop) ? "processing" : "need_file"
  }

  if (onChainStatus === "deploy" || onChainStatus === "topup") {
    return "need_deploy"
  }

  if (
    onChainStatus === "block" ||
    onChainStatus === "withdraw_ton" ||
    onChainStatus === "withdraw_jetton" ||
    onChainStatus === "withdraw_complete"
  ) {
    return "blocked"
  }

  if (airdrop.clam_status === "opened") {
    return "claim_active"
  }

  return "claim_stopped"
}

export function hasUploadedAirdropFile(airdrop: ADAirdropData) {
  return Boolean(
    airdrop.file_hash ||
      airdrop.file_name ||
      airdrop.processed ||
      airdrop.recipients ||
      airdrop.shards
  )
}

export function getAirdropOnChainStatus(
  distributors: ADDistributorData[]
): AirdropOnChainStatus {
  if (distributors.length === 0) {
    return "waiting"
  }

  if (distributors.some((item) => item.airdrop_status === "not_deployed")) {
    return "deploy"
  }

  if (distributors.some((item) => item.airdrop_status === "lack_of_jettons")) {
    return "topup"
  }

  if (distributors.some((item) => item.airdrop_status === "ready")) {
    return "ready"
  }

  const blocked = distributors.some((item) => item.airdrop_status === "blocked")
  if (!blocked) {
    return "waiting"
  }

  if (distributors.some((item) => item.jetton_withdrawal_message)) {
    return "withdraw_jetton"
  }

  if (distributors.some((item) => item.ton_withdrawal_message)) {
    return "withdraw_ton"
  }

  if (
    distributors.some(
      (item) => !item.jetton_withdrawal_message && !item.ton_withdrawal_message
    )
  ) {
    return "withdraw_complete"
  }

  return "block"
}

export function getAirdropOnChainAmount(
  distributors: ADDistributorData[],
  status: AirdropOnChainStatus
) {
  const matching = getAirdropOnChainMessages(distributors, status)
  if (!matching.length) {
    return null
  }

  return {
    ton: matching.reduce(
      (sum, message) => sum + parseBigIntString(message.amount),
      0n
    ),
    jetton:
      status === "topup"
        ? distributors
            .filter((item) => item.airdrop_status === "lack_of_jettons")
            .reduce(
              (sum, item) => sum + parseBigIntString(item.need_jettons),
              0n
            )
        : undefined,
  }
}

export function getAirdropOnChainMessages(
  distributors: ADDistributorData[],
  status: AirdropOnChainStatus
): AirdropTonConnectMessage[] {
  if (status === "deploy") {
    return distributors
      .filter((item) => item.airdrop_status === "not_deployed")
      .map((item) => item.deploy_message)
      .filter(isAirdropInternalMessage)
      .map(toTonConnectMessage)
  }

  if (status === "topup") {
    return distributors
      .filter((item) => item.airdrop_status === "lack_of_jettons")
      .map((item) => item.top_up_message)
      .filter(isAirdropInternalMessage)
      .map(toTonConnectMessage)
  }

  if (status === "ready") {
    return distributors
      .filter((item) => item.airdrop_status === "ready")
      .map((item) => item.block_message)
      .filter(isAirdropInternalMessage)
      .map(toTonConnectMessage)
  }

  if (status === "withdraw_jetton") {
    return distributors
      .filter((item) => item.airdrop_status === "blocked")
      .map((item) => item.jetton_withdrawal_message)
      .filter(isAirdropInternalMessage)
      .map(toTonConnectMessage)
  }

  if (status === "withdraw_ton") {
    return distributors
      .filter((item) => item.airdrop_status === "blocked")
      .map((item) => item.ton_withdrawal_message)
      .filter(isAirdropInternalMessage)
      .map(toTonConnectMessage)
  }

  return []
}

export function createAirdropTonConnectTransaction(
  messages: AirdropTonConnectMessage[]
): AirdropTonConnectTransaction {
  return {
    validUntil: Math.floor(Date.now() / 1000) + 120,
    messages,
  }
}

export function isWalletW5(walletStateInit: string | undefined) {
  if (!walletStateInit) {
    return false
  }

  try {
    const boc = Cell.fromBase64(walletStateInit)
    const code = boc.refs[0]
    return code.hash().toString("base64") === WALLET_W5_CODE_HASH
  } catch {
    return false
  }
}

export function formatNanoTonAmount(value: bigint | string | undefined) {
  if (value === undefined) {
    return "-"
  }

  return `${prettifyAirdropAmount(fromNano(value))} GRAM`
}

export function prettifyAirdropAmount(value: bigint | number | string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return String(value)
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 10,
  }).format(parsed)
}

export function getAirdropStatusLabel(status: AirdropSetupStatus) {
  const labels: Record<AirdropSetupStatus, string> = {
    need_file: "Needs file",
    processing: "Processing",
    need_deploy: "Deploy required",
    claim_active: "Claims open",
    claim_stopped: "Claims paused",
    blocked: "Blocked",
  }

  return labels[status]
}

export function getClaimStatusLabel(status: ADAirdropDataClamStatusEnum) {
  return status === "opened" ? "Opened" : "Closed"
}

export function getDistributorStatusLabel(
  status: ADDistributorDataAirdropStatusEnum
) {
  const labels: Record<ADDistributorDataAirdropStatusEnum, string> = {
    not_deployed: "Not deployed",
    lack_of_jettons: "Needs jettons",
    ready: "Ready",
    blocked: "Blocked",
  }

  return labels[status]
}

export function formatAirdropAmount(
  value: string | undefined,
  decimals: string | undefined,
  symbol: string | undefined
) {
  if (!value) {
    return "-"
  }

  const decimalsNumber = Number(decimals ?? 0)
  const divisor = 10 ** (Number.isFinite(decimalsNumber) ? decimalsNumber : 0)
  const amount = Number(value) / divisor

  if (!Number.isFinite(amount)) {
    return value
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 4,
  }).format(amount)}${symbol ? ` ${symbol}` : ""}`
}

export function formatAirdropDate(value: number) {
  const timestamp = value < 1_000_000_000_000 ? value * 1000 : value

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))
}

function isAirdropInternalMessage(
  message: ADInternalMessage | undefined
): message is ADInternalMessage {
  return Boolean(message?.address && message.amount)
}

function toTonConnectMessage(
  message: ADInternalMessage
): AirdropTonConnectMessage {
  return {
    address: message.address,
    amount: message.amount,
    stateInit: message.state_init,
    payload: message.payload,
  }
}

function parseBigIntString(value: string | undefined) {
  try {
    return BigInt(value ?? "0")
  } catch {
    return 0n
  }
}
