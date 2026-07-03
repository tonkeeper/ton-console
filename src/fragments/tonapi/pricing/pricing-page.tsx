import { useState } from "react"
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { Link } from "react-router"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { DTOProject } from "@/api/api.generated"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSelectedProject } from "@/hooks/use-project"

import {
  type LiteproxyTier,
  useCheckLiteproxyTierChangeMutation,
  useLiteproxyTiersQuery,
  useSelectedLiteproxyTierQuery,
  useUpdateLiteproxyTierMutation,
} from "@/utils/tonapi/liteservers/liteservers-queries"
import {
  type TonApiTier,
  useCheckTonApiTierChangeMutation,
  useSelectedTonApiTierQuery,
  useTonApiTiersQuery,
  useUpdateTonApiTierMutation,
} from "@/utils/tonapi/pricing/pricing-queries"
import {
  formatUsd,
  getApiErrorMessage,
} from "@/utils/tonapi/pricing/pricing-utils"
import { WEBHOOKS_DOCUMENTATION_URL } from "@/utils/tonapi/webhooks/webhook-utils"
import { FeedbackDialog } from "@/fragments/feedback/feedback-dialog"
import { TierCard } from "./tier-card"

const REST_API_DOCUMENTATION_URL = "https://docs.tonconsole.com/tonapi/rest-api"
const LITESERVERS_DOCUMENTATION_URL =
  "https://docs.tonconsole.com/tonapi/liteservers"

type TierDialogState =
  | { type: "confirm"; tier: TonApiTier; unspentMoney?: number }
  | { type: "blocked"; tier: TonApiTier; details?: string }
  | null

type LiteproxyTierDialogState =
  | { type: "confirm"; tier: LiteproxyTier; unspentMoney?: number }
  | { type: "blocked"; tier: LiteproxyTier; details?: string }
  | null

export function TonApiPricingPage() {
  const projectQuery = useSelectedProject()
  const tiersQuery = useTonApiTiersQuery()
  const currentTierQuery = useSelectedTonApiTierQuery()
  const checkChange = useCheckTonApiTierChangeMutation()
  const updateTier = useUpdateTonApiTierMutation()
  const [dialogState, setDialogState] = useState<TierDialogState>(null)
  const [pendingTierId, setPendingTierId] = useState<number | null>(null)

  const projectId = projectQuery.selectedProjectId
  const currentTier = currentTierQuery.data

  const selectTier = (tier: TonApiTier) => {
    setPendingTierId(tier.id)
    checkChange.mutate(tier.id, {
      onSuccess: (result) => {
        setPendingTierId(null)
        if (!result.valid) {
          setDialogState({
            type: "blocked",
            tier,
            details: result.details,
          })
          return
        }

        setDialogState({
          type: "confirm",
          tier,
          unspentMoney: result.unspent_money,
        })
      },
      onError: () => {
        setPendingTierId(null)
      },
    })
  }

  const confirmTier = () => {
    if (dialogState?.type !== "confirm") {
      return
    }

    updateTier.mutate(dialogState.tier.id, {
      onSuccess: () => setDialogState(null),
    })
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title="TonAPI pricing"
        description="Manage REST API, Liteservers, and Webhooks pricing for the selected project."
      />
      <Card>
        <CardHeader>
          <CardTitle>REST pricing</CardTitle>
          <CardDescription>
            Access TON blockchain data via REST API.{" "}
            <Link
              className="text-primary underline-offset-4 hover:underline"
              to="/tonapi/api-keys"
            >
              Get API keys
            </Link>{" "}
            or explore the{" "}
            <a
              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              href={REST_API_DOCUMENTATION_URL}
              target="_blank"
              rel="noreferrer"
            >
              API documentation
              <ExternalLink className="size-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pb-4">
          {projectQuery.isLoading ? (
            <LoadingState label="Loading project" />
          ) : null}

          {!projectQuery.isLoading && !projectId ? (
            <Alert>
              <AlertCircle />
              <AlertTitle>No project selected</AlertTitle>
              <AlertDescription>
                Create or select a project before changing TonAPI pricing.
              </AlertDescription>
            </Alert>
          ) : null}

          {currentTierQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error loading current tier</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(currentTierQuery.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          {tiersQuery.isLoading ? <LoadingState label="Loading tiers" /> : null}

          {tiersQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error loading tiers</AlertTitle>
              <AlertDescription>{getApiErrorMessage(tiersQuery.error)}</AlertDescription>
            </Alert>
          ) : null}

          {checkChange.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Unable to check tier change</AlertTitle>
              <AlertDescription>{getApiErrorMessage(checkChange.error)}</AlertDescription>
            </Alert>
          ) : null}

          {tiersQuery.isSuccess ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {tiersQuery.data.map((tier) => (
                <TierCard
                  key={tier.id}
                  name={tier.name}
                  priceUsd={tier.priceUsd}
                  priceLabel={tier.priceLabel}
                  billingLabel={tier.billingLabel}
                  rps={tier.rps}
                  current={currentTier?.id === tier.id}
                  disabled={!projectId || currentTierQuery.isLoading}
                  pending={pendingTierId === tier.id || updateTier.isPending}
                  onSelect={() => selectTier(tier)}
                />
              ))}
              <TierCard
                name="Custom"
                priceUsd={0}
                priceText="Custom"
                priceLabel="Contact us"
                billingLabel="Custom"
                rps="Unlimited"
                actionLabel="Request"
                actionWrapper={(action) => (
                  <FeedbackDialog
                    source="unlimited-restapi"
                    project={projectQuery.selectedProject}
                    trigger={action}
                  />
                )}
                details={["Dedicated limits", "Custom commercial terms"]}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <LiteproxyPricingSection
        project={projectQuery.selectedProject}
        projectId={projectId}
      />
      <WebhooksPricingSection />

      <TierChangeDialog
        state={dialogState}
        updateError={updateTier.error}
        pending={updateTier.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState(null)
          }
        }}
        onConfirm={confirmTier}
      />
    </div>
  )
}

function LiteproxyPricingSection({
  project,
  projectId,
}: {
  project?: DTOProject | null
  projectId?: number | null
}) {
  const tiersQuery = useLiteproxyTiersQuery()
  const currentTierQuery = useSelectedLiteproxyTierQuery()
  const checkChange = useCheckLiteproxyTierChangeMutation()
  const updateTier = useUpdateLiteproxyTierMutation()
  const [dialogState, setDialogState] = useState<LiteproxyTierDialogState>(null)
  const [pendingTierId, setPendingTierId] = useState<number | null>(null)

  const currentTier = currentTierQuery.data

  const selectTier = (tier: LiteproxyTier) => {
    setPendingTierId(tier.id)
    checkChange.mutate(tier.id, {
      onSuccess: (result) => {
        setPendingTierId(null)
        if (!result.valid) {
          setDialogState({
            type: "blocked",
            tier,
            details: result.details,
          })
          return
        }

        setDialogState({
          type: "confirm",
          tier,
          unspentMoney: result.unspent_money,
        })
      },
      onError: () => {
        setPendingTierId(null)
      },
    })
  }

  const confirmTier = () => {
    if (dialogState?.type !== "confirm") {
      return
    }

    updateTier.mutate(dialogState.tier.id, {
      onSuccess: () => setDialogState(null),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liteservers pricing</CardTitle>
        <CardDescription>
          Direct access to TON blockchain via Liteserver protocol.{" "}
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={LITESERVERS_DOCUMENTATION_URL}
            target="_blank"
            rel="noreferrer"
          >
            Learn more about Liteservers
            <ExternalLink className="size-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pb-4">
        {currentTierQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error loading current Liteservers tier</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(currentTierQuery.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        {tiersQuery.isLoading ? <LoadingState label="Loading Liteservers tiers" /> : null}

        {tiersQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error loading Liteservers tiers</AlertTitle>
            <AlertDescription>{getApiErrorMessage(tiersQuery.error)}</AlertDescription>
          </Alert>
        ) : null}

        {checkChange.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to check Liteservers tier change</AlertTitle>
            <AlertDescription>{getApiErrorMessage(checkChange.error)}</AlertDescription>
          </Alert>
        ) : null}

        {tiersQuery.isSuccess ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiersQuery.data.map((tier) => (
              <TierCard
                key={tier.id}
                name={tier.name}
                priceUsd={tier.priceUsd}
                priceLabel="monthly"
                billingLabel="Monthly"
                rps={tier.rps}
                current={currentTier?.id === tier.id}
                disabled={!projectId || currentTierQuery.isLoading}
                pending={pendingTierId === tier.id || updateTier.isPending}
                onSelect={() => selectTier(tier)}
              />
            ))}
            <TierCard
              name="Custom"
              priceUsd={0}
              priceText="Custom"
              priceLabel="Contact us"
              billingLabel="Custom"
              rps="Unlimited"
              actionLabel="Request"
              actionWrapper={(action) => (
                <FeedbackDialog
                  source="unlimited-liteservers"
                  project={project}
                  trigger={action}
                />
              )}
              details={["Dedicated endpoints", "Custom request limits"]}
            />
          </div>
        ) : null}
      </CardContent>
      <LiteproxyTierChangeDialog
        state={dialogState}
        updateError={updateTier.error}
        pending={updateTier.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState(null)
          }
        }}
        onConfirm={confirmTier}
      />
    </Card>
  )
}

function WebhooksPricingSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks pricing</CardTitle>
        <CardDescription>
          Usage-based pricing charged hourly for connected accounts and per
          message sent. Use the calculator to estimate monthly costs or read the{" "}
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={WEBHOOKS_DOCUMENTATION_URL}
            target="_blank"
            rel="noreferrer"
          >
            Webhooks documentation
            <ExternalLink className="size-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <WebhookPricingDiagram />
        <WebhooksPricingCalculator />
      </CardContent>
    </Card>
  )
}

const webhookTiers = {
  accounts: [
    { limit: 1_000_000, price: 60 },
    { limit: 10_000_000, price: 15 },
    { limit: Number.POSITIVE_INFINITY, price: 6 },
  ],
  messages: [
    { limit: 1_000_000, price: 300 },
    { limit: 10_000_000, price: 60 },
    { limit: Number.POSITIVE_INFINITY, price: 30 },
  ],
}

function WebhookPricingDiagram() {
  return (
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
        Prices are shown per million units. Usage is calculated progressively by
        tier, so larger volumes use cheaper marginal pricing.
      </p>
    </div>
  )
}

function WebhookPricingRow({
  title,
  tiers,
}: {
  title: string
  tiers: { limit: number; price: number }[]
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="grid overflow-hidden rounded-lg border md:grid-cols-3">
        {tiers.map((tier, index) => (
          <div key={`${title}-${tier.price}`} className="border-b p-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
            <div className="text-lg font-semibold">${tier.price}</div>
            <div className="text-xs text-muted-foreground">
              {index === 0
                ? "First 1M"
                : index === 1
                  ? "1M-10M"
                  : "Over 10M"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WebhooksPricingCalculator() {
  const [accounts, setAccounts] = useState("")
  const [messages, setMessages] = useState("")
  const estimatedPrice = calculateWebhookPrice(
    parsePositiveInt(accounts),
    parsePositiveInt(messages)
  )

  return (
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
          onChange={(event) => setNumericInput(event.target.value, setAccounts)}
        />
        <Input
          inputMode="numeric"
          placeholder="Messages sent"
          value={messages}
          onChange={(event) => setNumericInput(event.target.value, setMessages)}
        />
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
          <span className="text-sm text-muted-foreground">Estimated monthly price</span>
          <span className="font-semibold">{formatUsd(estimatedPrice)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function setNumericInput(
  value: string,
  setter: (value: string) => void
) {
  if (/^\d*$/.test(value)) {
    setter(value)
  }
}

function parsePositiveInt(value: string) {
  return value ? Number.parseInt(value, 10) : 0
}

function calculateWebhookPrice(accounts: number, messages: number) {
  return (
    calculateTieredPrice(accounts, webhookTiers.accounts) +
    calculateTieredPrice(messages, webhookTiers.messages)
  )
}

function calculateTieredPrice(
  value: number,
  tiers: { limit: number; price: number }[]
) {
  let remaining = value
  let previousLimit = 0
  let total = 0

  for (const tier of tiers) {
    const tierSize = tier.limit - previousLimit
    const units = Math.min(remaining, tierSize)
    total += (units * tier.price) / 1_000_000
    remaining -= units
    previousLimit = tier.limit

    if (remaining <= 0) {
      break
    }
  }

  return total
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 animate-spin" />
      {label}
    </div>
  )
}

function TierChangeDialog({
  state,
  updateError,
  pending,
  onOpenChange,
  onConfirm,
}: {
  state: TierDialogState
  updateError: unknown
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const open = Boolean(state)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state?.type === "blocked" ? "Tier change unavailable" : "Change tier"}
          </DialogTitle>
          <DialogDescription>
            {state?.type === "blocked"
              ? state.details ?? "This tier cannot be selected right now."
              : state
                ? `Switch this project to ${state.tier.name}.`
                : null}
          </DialogDescription>
        </DialogHeader>
        {state?.type === "confirm" ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <div className="font-medium">{state.tier.name}</div>
            <div className="text-muted-foreground">
              {formatUsd(state.tier.priceUsd)} {state.tier.priceLabel}, {state.tier.rps} RPS
            </div>
            {state.unspentMoney ? (
              <div className="mt-2 text-muted-foreground">
                Unspent balance credit: {formatUsd(state.unspentMoney)}
              </div>
            ) : null}
          </div>
        ) : null}
        {updateError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(updateError, "Tier was not changed.")}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              {state?.type === "blocked" ? "Close" : "Cancel"}
            </Button>
          </DialogClose>
          {state?.type === "confirm" ? (
            <Button onClick={onConfirm} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              Confirm
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LiteproxyTierChangeDialog({
  state,
  updateError,
  pending,
  onOpenChange,
  onConfirm,
}: {
  state: LiteproxyTierDialogState
  updateError: unknown
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={Boolean(state)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state?.type === "blocked" ? "Tier change unavailable" : "Change tier"}
          </DialogTitle>
          <DialogDescription>
            {state?.type === "blocked"
              ? state.details ?? "This liteproxy tier cannot be selected right now."
              : state
                ? `Switch liteproxy to ${state.tier.name}.`
                : null}
          </DialogDescription>
        </DialogHeader>
        {state?.type === "confirm" ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <div className="font-medium">{state.tier.name}</div>
            <div className="text-muted-foreground">
              {state.tier.priceUsd === 0 ? "$0" : `$${state.tier.priceUsd}`} monthly,{" "}
              {state.tier.rps} RPS
            </div>
            {state.unspentMoney ? (
              <div className="mt-2 text-muted-foreground">
                Unspent balance credit: ${state.unspentMoney}
              </div>
            ) : null}
          </div>
        ) : null}
        {updateError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(updateError, "Tier was not changed.")}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              {state?.type === "blocked" ? "Close" : "Cancel"}
            </Button>
          </DialogClose>
          {state?.type === "confirm" ? (
            <Button onClick={onConfirm} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              Confirm
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
