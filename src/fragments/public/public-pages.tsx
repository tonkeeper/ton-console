import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import {
  AlertCircle,
  BadgeDollarSign,
  BookOpen,
  Braces,
  Calculator,
  CircleDollarSign,
  ExternalLink,
  Globe2,
  Handshake,
  KeyRound,
  Loader2,
  MessageSquare,
  Server,
  Send,
  Zap,
  Webhook,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import TonConsoleLogo from "@/assets/ton-console-logo.svg"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FeedbackDialog } from "@/fragments/feedback/feedback-dialog"
import { useSessionQuery } from "@/hooks/use-auth"
import {
  useTelegramAuthAvailability,
  useTelegramLoginMutation,
} from "@/hooks/use-telegram-auth"
import { PublicAuthPanel } from "@/fragments/public/public-auth-panel"
import { useLiteproxyTiersQuery } from "@/utils/tonapi/liteservers/liteservers-queries"
import { useTonApiTiersQuery } from "@/utils/tonapi/pricing/pricing-queries"
import { formatUsd } from "@/utils/tonapi/pricing/pricing-utils"

const features = [
  {
    title: "API keys",
    description: "Create and rotate TonAPI keys for production projects.",
    icon: KeyRound,
  },
  {
    title: "Webhooks",
    description: "Manage TonAPI RT webhooks and inspect delivery settings.",
    icon: Webhook,
  },
  {
    title: "Payments",
    description: "Work with invoices, balances, billing, and service usage.",
    icon: CircleDollarSign,
  },
  {
    title: "Assets",
    description: "Operate NFT, Jetton, and faucet tools from the same console.",
    icon: Braces,
  },
]

type MarketingFeatureVariant =
  | "api"
  | "browser"
  | "messages"
  | "partnership"
  | "payments"
  | "ramp"
  | "swap"

type MarketingFeature = {
  title: string
  description: string
  action: string
  href?: string
  anchor?: string
  source?: string
  icon: ComponentType<{ className?: string }>
  metric: string
  span: string
  variant: MarketingFeatureVariant
}

const marketingFeatures: MarketingFeature[] = [
  {
    title: "On-Ramp",
    description:
      "Place your exchange, payment solution, or DEX under Tonkeeper's Buy button and reach high-intent buyers.",
    action: "Become Partner",
    source: "on-ramp",
    icon: BadgeDollarSign,
    metric: "Buy flow",
    span: "xl:col-span-3",
    variant: "ramp",
  },
  {
    title: "Tonkeeper Browser",
    description:
      "Get discovery from Tonkeeper's app catalog and turn subscribers into repeat revenue.",
    action: "Request Slot",
    source: "tonkeeper-browser",
    icon: Globe2,
    metric: "Discovery",
    span: "xl:col-span-3",
    variant: "browser",
  },
  {
    title: "Swap",
    description:
      "Feature your DEX inside Tonkeeper Swap and convert wallet traffic directly into trades.",
    action: "Become Partner",
    source: "swap",
    icon: Zap,
    metric: "Liquidity",
    span: "xl:col-span-2",
    variant: "swap",
  },
  {
    title: "Tonkeeper Messages",
    description:
      "Send trusted in-wallet messages to Tonkeeper users to boost retention and conversion.",
    action: "Connect and Try",
    href: "/messages",
    icon: MessageSquare,
    metric: "Retention",
    span: "xl:col-span-2",
    variant: "messages",
  },
  {
    title: "GRAM Payments",
    description:
      "Track and manage GRAM transactions with a reliable payment service built for product teams.",
    action: "Connect and Try",
    href: "/invoices/dashboard",
    icon: CircleDollarSign,
    metric: "Payments",
    span: "xl:col-span-2",
    variant: "payments",
  },
  {
    title: "TON API",
    description:
      "Create API keys, webhooks, and liteserver access for production TON applications.",
    action: "See Pricing",
    anchor: "#ton-api-pricing",
    icon: Server,
    metric: "Infra",
    span: "xl:col-span-3",
    variant: "api",
  },
  {
    title: "Premium Partnership",
    description:
      "Request commercial terms and co-marketing for high-potential TON products.",
    action: "Request Partnership",
    source: "premium-partnership",
    icon: Handshake,
    metric: "Growth",
    span: "xl:col-span-3",
    variant: "partnership",
  },
]

const webhookTiers = {
  accounts: [
    { limit: 1_000_000, price: 60 },
    { limit: 10_000_000, price: 15 },
    { limit: Infinity, price: 6 },
  ],
  messages: [
    { limit: 1_000_000, price: 300 },
    { limit: 10_000_000, price: 60 },
    { limit: Infinity, price: 30 },
  ],
}

const serviceNames: Record<string, string> = {
  analytics: "TON Analytics",
  billing: "Balance/Billing",
  faucet: "Testnet Assets",
  invoices: "GRAM Payments",
  jetton: "Jetton",
  messages: "Tonkeeper Messages",
  nft: "NFT",
  tonapi: "TonAPI",
}

const footerLinks = [
  { label: "Docs", href: "https://docs.tonconsole.com" },
  { label: "Support", href: "https://t.me/ton_console_bot" },
  { label: "Telegram Channel", href: "https://t.me/tonconsole_com" },
]

export function LandingPage() {
  const navigate = useNavigate()
  const session = useSessionQuery()
  const telegramAvailability = useTelegramAuthAvailability()
  const telegramLogin = useTelegramLoginMutation()

  useEffect(() => {
    if (session.data) {
      navigate("/dashboard", { replace: true })
    }
  }, [navigate, session.data])

  return (
    <main className="min-h-svh bg-muted/20">
      <PublicHeader />
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center md:px-6 md:py-16">
        <div className="grid max-w-3xl gap-4">
          <h1 className="text-3xl font-semibold tracking-normal text-balance md:text-5xl">
            Connecting businesses to the TON ecosystem
          </h1>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Launch a successful business with the TON blockchain: manage Dapps,
            tokens, and payments in just one place with a deeply integrated
            commercial API.
          </p>
        </div>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            type="button"
            disabled={
              !telegramAvailability.isConfigured || telegramLogin.isPending
            }
            onClick={() => telegramLogin.mutate()}
            size="lg"
          >
            {telegramLogin.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Connect and Try
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://docs.tonconsole.com/"
              rel="noreferrer"
              target="_blank"
            >
              <BookOpen className="size-4" />
              Documentation
            </a>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-10 md:grid-cols-4 md:px-6 md:pb-16">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 pb-10 md:px-6 md:pb-16">
        <h2 className="font-heading text-2xl font-semibold tracking-normal md:text-3xl">
          Features
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {marketingFeatures.map((feature) => (
            <MarketingFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section
        id="ton-api-pricing"
        className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-12 md:px-6 md:pb-20"
      >
        <div className="grid gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-normal">
            TON API Pricing
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Start free, then scale REST API, liteserver, and webhook capacity
            from the console.
          </p>
        </div>
        <PublicTonApiPricing />
      </section>
      <PublicFooter />
    </main>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = useSessionQuery()
  const returnTo = useMemo(() => getReturnTo(location.state), [location.state])
  const serviceName = useMemo(() => getServiceName(returnTo), [returnTo])

  useEffect(() => {
    if (session.data) {
      navigate(returnTo, { replace: true })
    }
  }, [navigate, returnTo, session.data])

  return (
    <main className="flex h-svh flex-col bg-muted/20">
      <PublicHeader />
      <section className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-8 text-center md:px-6">
        <div className="grid gap-4">
          <h1 className="text-3xl font-semibold tracking-normal text-balance md:text-4xl">
            {serviceName
              ? `Sign in to access ${serviceName}`
              : "Sign in to access TON Console"}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Please connect to your account to start using the service
          </p>
        </div>
        <PublicAuthPanel />
      </section>
      <PublicFooter />
    </main>
  )
}

function PublicHeader() {
  const telegramAvailability = useTelegramAuthAvailability()
  const telegramLogin = useTelegramLoginMutation()

  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-medium">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground dark:bg-white">
            <span
              className="flex size-6 items-center justify-center"
              aria-hidden="true"
            >
              <TonConsoleLogo />
            </span>
          </span>
          <span className="truncate">TON Console</span>
        </Link>
        <Button
          type="button"
          disabled={!telegramAvailability.isConfigured || telegramLogin.isPending}
          onClick={() => telegramLogin.mutate()}
        >
          {telegramLogin.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Continue with Telegram
        </Button>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl shrink-0 flex-wrap gap-x-6 gap-y-2 px-4 pb-8 text-sm text-muted-foreground md:justify-center md:px-6">
      {footerLinks.map((link) => (
        <a
          key={link.href}
          className="p-1 transition-colors hover:text-foreground"
          href={link.href}
          rel="noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      ))}
    </footer>
  )
}

function MarketingFeatureCard({
  feature,
}: {
  feature: MarketingFeature
}) {
  const Icon = feature.icon

  return (
    <Card
      className={`group overflow-hidden border-primary/10 bg-background/80 pt-0 shadow-sm transition-colors hover:border-primary/30 ${feature.span}`}
    >
      <div className="relative h-44 overflow-hidden border-b bg-slate-950">
        <div className="absolute inset-0 scale-[1.08] blur-[10px]">
          <MarketingFeatureScene variant={feature.variant} />
        </div>
        <div className="absolute inset-x-6 top-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100 backdrop-blur">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
            {feature.metric}
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-cyan-100 shadow-[0_0_32px_rgba(14,165,233,0.18)] backdrop-blur transition-transform group-hover:scale-105">
            <Icon className="size-5" />
          </div>
        </div>
        <div className="absolute inset-x-6 bottom-6">
          <div className="max-w-64 text-xl font-semibold tracking-normal text-white drop-shadow-[0_2px_12px_rgba(2,6,23,0.75)]">
            {feature.title}
          </div>
        </div>
      </div>
      <CardHeader className="gap-3">
        <CardDescription>{feature.description}</CardDescription>
        {feature.href ? (
          <Button asChild className="mt-2 w-fit">
            <Link to={feature.href}>
              <Send className="size-4" />
              {feature.action}
            </Link>
          </Button>
        ) : feature.anchor ? (
          <Button asChild className="mt-2 w-fit" variant="outline">
            <a href={feature.anchor}>
              <ExternalLink className="size-4" />
              {feature.action}
            </a>
          </Button>
        ) : (
          <FeedbackDialog
            source={feature.source ?? feature.title}
            trigger={
              <Button type="button" className="mt-2 w-fit" variant="outline">
                <MessageSquare className="size-4" />
                {feature.action}
              </Button>
            }
          />
        )}
      </CardHeader>
    </Card>
  )
}

function MarketingFeatureScene({
  variant,
}: {
  variant: MarketingFeatureVariant
}) {
  if (variant === "ramp") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(34,211,238,0.32),transparent_28%),linear-gradient(135deg,rgba(8,47,73,0.95),rgba(2,6,23,1)_62%)]">
        <div className="absolute left-8 top-20 h-16 w-24 rounded-2xl border border-cyan-200/20 bg-cyan-200/10 shadow-[0_0_34px_rgba(34,211,238,0.16)]" />
        <div className="absolute left-[42%] top-14 h-24 w-1 rounded-full bg-cyan-300/50 shadow-[0_0_22px_rgba(103,232,249,0.8)]" />
        <div className="absolute right-8 top-24 h-10 w-28 rounded-full border border-white/15 bg-white/10" />
      </div>
    )
  }

  if (variant === "browser") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(125,211,252,0.28),transparent_32%),linear-gradient(160deg,rgba(15,23,42,1),rgba(8,47,73,0.95))]">
        <div className="absolute left-8 top-20 grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span
              key={item}
              className="size-8 rounded-lg border border-white/10 bg-white/10"
            />
          ))}
        </div>
        <div className="absolute right-10 top-14 size-24 rounded-full border border-cyan-200/20" />
        <div className="absolute right-20 top-24 size-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,1)]" />
      </div>
    )
  }

  if (variant === "swap") {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(6,78,59,0.9),rgba(2,6,23,1)_58%)]">
        <div className="absolute left-8 top-24 h-px w-40 rotate-[-18deg] bg-emerald-300/70 shadow-[0_0_20px_rgba(110,231,183,0.8)]" />
        <div className="absolute right-8 top-24 h-px w-40 rotate-[18deg] bg-cyan-300/70 shadow-[0_0_20px_rgba(103,232,249,0.8)]" />
        <div className="absolute left-12 top-20 size-9 rounded-full border border-emerald-200/30 bg-emerald-200/10" />
        <div className="absolute right-12 top-20 size-9 rounded-full border border-cyan-200/30 bg-cyan-200/10" />
      </div>
    )
  }

  if (variant === "messages") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_46%,rgba(59,130,246,0.28),transparent_30%),linear-gradient(155deg,rgba(30,41,59,1),rgba(2,6,23,1))]">
        <div className="absolute left-8 top-20 h-12 w-36 rounded-2xl rounded-bl-sm border border-sky-200/20 bg-sky-200/10" />
        <div className="absolute right-8 top-28 h-10 w-28 rounded-2xl rounded-br-sm border border-cyan-200/20 bg-cyan-200/10" />
        <div className="absolute left-20 top-32 size-2 rounded-full bg-sky-200 shadow-[0_0_18px_rgba(191,219,254,1)]" />
      </div>
    )
  }

  if (variant === "payments") {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(22,78,99,0.95),rgba(2,6,23,1)_68%)]">
        <div className="absolute left-9 top-16 grid w-32 gap-2 rounded-2xl border border-white/10 bg-white/10 p-4">
          <span className="h-2 rounded-full bg-cyan-200/70" />
          <span className="h-2 w-20 rounded-full bg-white/20" />
          <span className="h-2 w-24 rounded-full bg-white/20" />
        </div>
        <div className="absolute right-10 top-28 text-3xl font-semibold tracking-normal text-cyan-100/80">
          $
        </div>
      </div>
    )
  }

  if (variant === "api") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.26),transparent_30%),linear-gradient(180deg,rgba(15,23,42,1),rgba(2,6,23,1))]">
        <div className="absolute left-12 top-24 h-px w-48 bg-cyan-300/40" />
        <div className="absolute left-24 top-16 h-20 w-px bg-cyan-300/30" />
        <span className="absolute left-10 top-20 size-8 rounded-xl border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]" />
        <span className="absolute left-24 top-12 size-8 rounded-xl border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]" />
        <span className="absolute left-44 top-20 size-8 rounded-xl border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]" />
        <span className="absolute right-12 top-28 size-8 rounded-xl border border-cyan-200/25 bg-cyan-200/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(165,180,252,0.28),transparent_30%),linear-gradient(145deg,rgba(49,46,129,0.8),rgba(2,6,23,1)_66%)]">
      <div className="absolute left-10 top-24 h-px w-52 rotate-[-10deg] bg-indigo-200/30" />
      <div className="absolute right-12 top-16 h-24 w-px rotate-[22deg] bg-cyan-200/30" />
      <span className="absolute left-9 top-20 size-3 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(224,231,255,0.9)]" />
      <span className="absolute left-28 top-28 size-3 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(224,231,255,0.9)]" />
      <span className="absolute right-20 top-14 size-3 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(224,231,255,0.9)]" />
      <span className="absolute right-10 top-32 size-3 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(224,231,255,0.9)]" />
    </div>
  )
}

function PublicTonApiPricing() {
  const tonApiTiers = useTonApiTiersQuery()
  const liteproxyTiers = useLiteproxyTiersQuery()

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="size-4 text-primary" />
            REST API
          </CardTitle>
          <CardDescription>
            Production REST throughput tiers from the current API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TierPreviewGrid
            isLoading={tonApiTiers.isLoading}
            isError={tonApiTiers.isError}
            items={(tonApiTiers.data ?? []).map((tier) => ({
              key: tier.id,
              name: tier.name,
              price: formatUsd(tier.priceUsd),
              description: tier.priceLabel,
              metric: `${tier.rps} RPS`,
            }))}
            emptyMessage="REST API tiers are not available right now."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="size-4 text-primary" />
            Liteservers
          </CardTitle>
          <CardDescription>
            Private liteserver access tiers from the current API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TierPreviewGrid
            isLoading={liteproxyTiers.isLoading}
            isError={liteproxyTiers.isError}
            items={(liteproxyTiers.data ?? []).map((tier) => ({
              key: tier.id,
              name: tier.name,
              price: formatUsd(tier.priceUsd),
              description: "monthly",
              metric: `${tier.rps} RPS`,
            }))}
            emptyMessage="Liteserver tiers are not available right now."
          />
        </CardContent>
      </Card>

      <WebhooksPricingPreview />
    </div>
  )
}

function TierPreviewGrid({
  emptyMessage,
  isError,
  isLoading,
  items,
}: {
  emptyMessage: string
  isError: boolean
  isLoading: boolean
  items: Array<{
    key: number
    name: string
    price: string
    description: string
    metric: string
  }>
}) {
  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading tiers
      </div>
    )
  }

  if (isError) {
    return (
      <Alert>
        <AlertCircle />
        <AlertTitle>Pricing unavailable</AlertTitle>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="rounded-lg border bg-muted/30 p-4">
          <div className="font-medium">{item.name}</div>
          <div className="mt-3 text-2xl font-semibold tracking-normal">
            {item.price}
          </div>
          <div className="text-sm text-muted-foreground">
            {item.description}
          </div>
          <div className="mt-3 text-sm font-medium">{item.metric}</div>
        </div>
      ))}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="font-medium">Custom</div>
        <div className="mt-3 text-2xl font-semibold tracking-normal">
          Custom
        </div>
        <div className="text-sm text-muted-foreground">Contact us</div>
        <FeedbackDialog
          source="public_tonapi_custom"
          trigger={
            <Button type="button" variant="outline" size="sm" className="mt-4">
              <MessageSquare className="size-4" />
              Request
            </Button>
          }
        />
      </div>
    </div>
  )
}

function WebhooksPricingPreview() {
  const [accounts, setAccounts] = useState("")
  const [messages, setMessages] = useState("")
  const estimatedPrice = calculateExpectedWebhookPrice(
    parseOptionalNumber(accounts),
    parseOptionalNumber(messages)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="size-4 text-primary" />
          Webhooks
        </CardTitle>
        <CardDescription>
          Usage-based pricing for subscribed accounts and delivered messages.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <WebhookPricingRow
            title="Subscribed accounts"
            tiers={webhookTiers.accounts}
          />
          <WebhookPricingRow
            title="Messages sent"
            tiers={webhookTiers.messages}
          />
          <p className="text-sm text-muted-foreground">
            Prices are shown per million units. Usage is calculated
            progressively by tier, so larger volumes use cheaper marginal
            pricing.
          </p>
        </div>
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Pricing calculator</CardTitle>
            <CardDescription>Estimate monthly webhook costs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Input
              inputMode="numeric"
              placeholder="Subscribed accounts"
              value={accounts}
              onChange={(event) =>
                setNumericInput(event.target.value, setAccounts)
              }
            />
            <Input
              inputMode="numeric"
              placeholder="Messages sent"
              value={messages}
              onChange={(event) =>
                setNumericInput(event.target.value, setMessages)
              }
            />
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
              <span className="text-sm text-muted-foreground">
                Estimated monthly price
              </span>
              <span className="font-semibold">
                {formatUsd(estimatedPrice)}
              </span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function WebhookPricingRow({
  title,
  tiers,
}: {
  title: string
  tiers: Array<{ limit: number; price: number }>
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="grid overflow-hidden rounded-lg border md:grid-cols-3">
        {tiers.map((tier, index) => (
          <div
            key={`${title}-${tier.price}`}
            className="border-b p-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="text-lg font-semibold">${tier.price}</div>
            <div className="text-xs text-muted-foreground">
              {index === 0 ? "First 1M" : index === 1 ? "1M-10M" : "Over 10M"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function setNumericInput(value: string, setter: (value: string) => void) {
  if (/^\d*$/.test(value)) {
    setter(value)
  }
}

function parseOptionalNumber(value: string) {
  return value ? Number(value) : 0
}

function calculateExpectedWebhookPrice(accounts: number, messages: number) {
  return (
    calculateTieredPrice(accounts, webhookTiers.accounts) +
    calculateTieredPrice(messages, webhookTiers.messages)
  )
}

function calculateTieredPrice(
  input: number,
  tiers: Array<{ limit: number; price: number }>
) {
  let previousLimit = 0
  let remaining = input
  let total = 0

  for (const tier of tiers) {
    const tierLimit = tier.limit - previousLimit
    const value = Math.min(remaining, tierLimit)
    total += (value * tier.price) / 1_000_000
    remaining -= value
    previousLimit = tier.limit

    if (remaining <= 0) {
      break
    }
  }

  return total
}

function getReturnTo(state: unknown) {
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    state.from &&
    typeof state.from === "object" &&
    "pathname" in state.from &&
    typeof state.from.pathname === "string"
  ) {
    const from = state.from as {
      pathname: string
      search?: unknown
      hash?: unknown
    }

    return `${from.pathname}${typeof from.search === "string" ? from.search : ""}${
      typeof from.hash === "string" ? from.hash : ""
    }`
  }

  return "/dashboard"
}

function getServiceName(path: string) {
  const firstSegment = path.split("/").filter(Boolean)[0]

  return firstSegment ? serviceNames[firstSegment] : undefined
}
