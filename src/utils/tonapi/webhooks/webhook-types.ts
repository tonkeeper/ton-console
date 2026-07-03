import type {
  RTWebhookAccountTxSubscriptions,
  RTWebhookList,
  RTWebhookLogs,
  RTWebhookMsgOpcodeSubscriptions,
} from "@/api/webhooks.generated"

export type WebhookNetwork = "mainnet" | "testnet"

export type Webhook = RTWebhookList["webhooks"][number]

export type AccountSubscription =
  RTWebhookAccountTxSubscriptions["account_tx_subscriptions"][number]

export type OpcodeSubscription =
  RTWebhookMsgOpcodeSubscriptions["subscriptions"][number]

export type FailureLog = RTWebhookLogs["logs"][number]

