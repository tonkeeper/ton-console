import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import { client as tonApi } from "@/api/tonapi"
import {
  DTOBillingTransactionTypeEnum,
  DTOCryptoCurrency,
  type DTOAppTier,
  type DTOBalance,
  type DTOBillingTransaction,
  type DTOProjectLiteproxyTierDetail,
} from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

export type BalanceAmount = {
  amount: number
  promoAmount: number
  total: number
}

export type BillingBalances = {
  usdt: BalanceAmount
  ton?: BalanceAmount
}

export type DepositAddress = {
  currency: "USDT" | "TON"
  address: string
}

export type BillingHistoryItem = {
  id: string
  type: DTOBillingTransactionTypeEnum
  currency: DTOCryptoCurrency
  amount: number
  description: string
  createdAt: Date
}

export type BillingSubscription = {
  id: string
  service: string
  plan: string
  interval: string
  price: number
  renewsAt?: Date
  meta: string
  changePlanHref: string
}

const BILLING_HISTORY_QUERY_KEY = ["billing", "history"] as const
const DEPOSIT_ADDRESS_QUERY_KEY = ["billing", "deposit-address"] as const
const SUBSCRIPTIONS_QUERY_KEY = ["billing", "subscriptions"] as const
const TON_RATE_QUERY_KEY = ["billing", "ton-rate"] as const

export type BillingHistoryQueryOptions = {
  beforeTx?: string
  limit?: number
}

function getProjectQueryKey(
  key: readonly string[],
  projectId: number | null | undefined
) {
  return [...key, projectId] as const
}

export function useBillingHistoryQuery(
  options: BillingHistoryQueryOptions = {}
) {
  const { selectedProjectId: projectId } = useSelectedProject()
  const { beforeTx, limit = 50 } = options

  return useQuery({
    queryKey: [
      ...getProjectQueryKey(BILLING_HISTORY_QUERY_KEY, projectId),
      beforeTx,
      limit,
    ] as const,
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getProjectBillingHistory(
        projectId,
        { before_tx: beforeTx, limit },
        { format: "json" }
      )

      return {
        balances: mapBalances(
          response.data.usdt_balance,
          response.data.ton_balance
        ),
        history: response.data.history.map(mapBillingTransaction),
      }
    },
    refetchInterval: 30 * 1000,
  })
}

export function useDepositAddressesQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getProjectQueryKey(DEPOSIT_ADDRESS_QUERY_KEY, projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const response = await api.api.getDepositAddress(projectId, {
        format: "json",
      })

      const addresses: DepositAddress[] = [
        {
          currency: "USDT",
          address: response.data.usdt_deposit_wallet,
        },
      ]

      if (response.data.ton_deposit_wallet) {
        addresses.push({
          currency: "TON",
          address: response.data.ton_deposit_wallet,
        })
      }

      return addresses
    },
  })
}

export function useBillingSubscriptionsQuery() {
  const { selectedProjectId: projectId } = useSelectedProject()

  return useQuery({
    queryKey: getProjectQueryKey(SUBSCRIPTIONS_QUERY_KEY, projectId),
    enabled: Boolean(projectId),
    queryFn: async () => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      const [tonApiTier, liteproxyTier] = await Promise.allSettled([
        api.api.getProjectTonApiTier(
          { project_id: projectId },
          { format: "json" }
        ),
        api.api.getProjectLiteproxyTier(
          { project_id: projectId },
          { format: "json" }
        ),
      ])

      const subscriptions: BillingSubscription[] = []

      if (tonApiTier.status === "fulfilled") {
        subscriptions.push(mapTonApiSubscription(tonApiTier.value.data.tier))
      }

      if (liteproxyTier.status === "fulfilled") {
        subscriptions.push(
          mapLiteproxySubscription(liteproxyTier.value.data.tier)
        )
      }

      return subscriptions
    },
    staleTime: 30 * 1000,
  })
}

export function useTonRateQuery() {
  return useQuery({
    queryKey: TON_RATE_QUERY_KEY,
    queryFn: async () => {
      const response = await tonApi.rates.getRates({
        tokens: ["ton"],
        currencies: ["usd"],
      })

      return getUsdRateFromTonApiResponse(response.rates)
    },
    staleTime: 60 * 1000,
    retry: 1,
  })
}

export function useApplyPromoCodeMutation() {
  const queryClient = useQueryClient()
  const { selectedProjectId: projectId } = useSelectedProject()

  return useMutation({
    mutationFn: async (promoCode: string) => {
      if (!projectId) {
        throw new Error("No project selected")
      }

      await api.api.promoCodeDepositProject(projectId, promoCode, {
        format: "json",
      })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getProjectQueryKey(BILLING_HISTORY_QUERY_KEY, projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: getProjectQueryKey(DEPOSIT_ADDRESS_QUERY_KEY, projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: getProjectQueryKey(SUBSCRIPTIONS_QUERY_KEY, projectId),
        }),
      ])
    },
  })
}

function mapBalances(usdtBalance: DTOBalance, tonBalance?: DTOBalance) {
  return {
    usdt: mapBalance(usdtBalance, 6),
    ...(tonBalance ? { ton: mapBalance(tonBalance, 9) } : {}),
  } satisfies BillingBalances
}

function mapBalance(balance: DTOBalance, decimals: number): BalanceAmount {
  const amount = fromAtomicAmount(balance.amount, decimals)
  const promoAmount = fromAtomicAmount(balance.promo_amount, decimals)

  return {
    amount,
    promoAmount,
    total: amount + promoAmount,
  }
}

function getUsdRateFromTonApiResponse(
  rates: Record<string, { prices?: Record<string, number> }>
) {
  const tonRates = rates.TON ?? rates.ton ?? rates.GRAM ?? rates.gram
  const usdRate = tonRates?.prices?.USD ?? tonRates?.prices?.usd

  if (typeof usdRate !== "number" || Number.isNaN(usdRate)) {
    return null
  }

  return usdRate
}

function mapBillingTransaction(
  transaction: DTOBillingTransaction
): BillingHistoryItem {
  return {
    id: transaction.id,
    type: transaction.type,
    currency: transaction.currency,
    amount: fromAtomicAmount(
      transaction.amount,
      transaction.currency === DTOCryptoCurrency.DTO_USDT ? 6 : 9
    ),
    description:
      transaction.description || formatBillingReason(transaction.info.reason),
    createdAt: timestampToDate(transaction.created_at),
  }
}

function mapTonApiSubscription(tier: DTOAppTier): BillingSubscription {
  return {
    id: `tonapi-${tier.id}`,
    service: "TonAPI",
    plan: tier.name,
    interval: tier.instant_payment ? "Pay as you go" : "Monthly",
    price: tier.instant_payment ? tier.usd_price * 1000 : tier.usd_price,
    renewsAt: tier.next_payment ? timestampToDate(tier.next_payment) : undefined,
    meta: `${tier.rpc} RPS`,
    changePlanHref: "/tonapi/pricing",
  }
}

function mapLiteproxySubscription(
  tier: DTOProjectLiteproxyTierDetail
): BillingSubscription {
  return {
    id: `liteproxy-${tier.id}`,
    service: "Liteservers",
    plan: tier.name,
    interval: "Monthly",
    price: tier.usd_price,
    renewsAt: tier.next_payment ? timestampToDate(tier.next_payment) : undefined,
    meta: `${tier.rps} RPS`,
    changePlanHref: "/tonapi/liteservers",
  }
}

function fromAtomicAmount(value: string, decimals: number) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return parsed / 10 ** decimals
}

function timestampToDate(timestamp: number) {
  return new Date(timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp)
}

function formatBillingReason(reason: string) {
  return reason
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
