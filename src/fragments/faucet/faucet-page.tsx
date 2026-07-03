import { type FormEvent, useId, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  AlertCircle,
  CheckCircle2,
  Droplets,
  ExternalLink,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useSelectedProject } from "@/hooks/use-project"

import {
  useBuyTestnetCoinsMutation,
  useTestnetAvailableQuery,
} from "@/utils/faucet/faucet-queries"
import {
  formatTonAmount,
  formatUsdAmount,
  getApiErrorMessage,
  getTestnetExplorerTransactionUrl,
  isTonAddress,
  normalizeTonAddress,
  parseTonToNano,
} from "@/utils/faucet/faucet-utils"

type FaucetFormValues = {
  amount: string
  address: string
}

type FaucetFormErrors = Partial<Record<keyof FaucetFormValues, string>>

const defaultValues: FaucetFormValues = {
  amount: "",
  address: "",
}

type PendingPurchase = {
  amountNano: number
  address: string
  price: number | null
}

export function FaucetPage() {
  const formId = useId()
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const availableQuery = useTestnetAvailableQuery()
  const buyCoins = useBuyTestnetCoinsMutation()
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState<FaucetFormErrors>({})
  const [latestHash, setLatestHash] = useState<string | null>(null)
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase | null>(
    null
  )

  const requestedNano = useMemo(() => parseTonToNano(values.amount), [values])
  const requestedTon =
    requestedNano !== null ? requestedNano / 1_000_000_000 : 0
  const estimatedPrice =
    availableQuery.data && requestedNano !== null
      ? requestedTon * availableQuery.data.usd_per_testnet_ton
      : null

  if (projectLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  if (projectError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Projects could not be loaded</AlertTitle>
        <AlertDescription>{getApiErrorMessage(projectError)}</AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Droplets />
          </EmptyMedia>
          <EmptyTitle>Select or create a project</EmptyTitle>
          <EmptyDescription>
            Testnet coins are purchased per TON Console project.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(values, availableQuery.data?.balance)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || requestedNano === null) {
      return
    }

    setPendingPurchase({
      amountNano: requestedNano,
      address: normalizeTonAddress(values.address),
      price: estimatedPrice,
    })
  }

  const confirmPurchase = () => {
    if (!pendingPurchase) {
      return
    }

    buyCoins.mutate(
      {
        address: pendingPurchase.address,
        coins: pendingPurchase.amountNano,
      },
      {
        onSuccess: (data) => {
          setLatestHash(data.hash)
          setPendingPurchase(null)
          toast.success("Testnet coins purchase requested")
          setValues(defaultValues)
        },
      }
    )
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Testnet Faucet"
        description="Buy testnet GRAM for development wallets using this project's billing account."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Request testnet coins</CardTitle>
            <CardDescription>
              Enter a recipient address and amount. The backend expects the
              amount in nanoGRAM.
            </CardDescription>
            <CardAction>
              <Button
                type="button"
                variant="outline"
                disabled={availableQuery.isFetching}
                onClick={() => availableQuery.refetch()}
              >
                {availableQuery.isFetching ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                Refresh
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form
              id={formId}
              className="grid gap-4"
              noValidate
              onSubmit={submit}
            >
              <Field data-invalid={Boolean(errors.amount)}>
                <FieldLabel htmlFor="faucet-amount">
                  Amount
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="faucet-amount"
                    value={values.amount}
                    inputMode="decimal"
                    placeholder="10"
                    required
                    disabled={buyCoins.isPending}
                    onChange={(event) => {
                      setValues((current) => ({
                        ...current,
                        amount: event.target.value.replace(",", "."),
                      }))
                      setErrors((current) => ({
                        ...current,
                        amount: undefined,
                      }))
                    }}
                  />
                  <InputGroupAddon align="inline-end">GRAM</InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Available:{" "}
                  {availableQuery.data
                    ? `${formatTonAmount(availableQuery.data.balance)} testnet GRAM`
                    : "loading"}
                  {estimatedPrice !== null
                    ? ` · Estimated price ${formatUsdAmount(estimatedPrice)}`
                    : null}
                </FieldDescription>
                <FieldError>{errors.amount}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.address)}>
                <FieldLabel htmlFor="faucet-address">
                  Recipient testnet address
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="faucet-address"
                  value={values.address}
                  autoComplete="off"
                  placeholder="UQ..."
                  required
                  disabled={buyCoins.isPending}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                    setErrors((current) => ({
                      ...current,
                      address: undefined,
                    }))
                  }}
                />
                <FieldDescription>
                  Raw and user-friendly TON addresses are accepted.
                </FieldDescription>
                <FieldError>{errors.address}</FieldError>
              </Field>

              {availableQuery.isError ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Faucet supply unavailable</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(availableQuery.error)}
                  </AlertDescription>
                </Alert>
              ) : null}

              {buyCoins.isError ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Purchase failed</AlertTitle>
                  <AlertDescription>
                    {getApiErrorMessage(buyCoins.error)}
                  </AlertDescription>
                </Alert>
              ) : null}

              {latestHash ? (
                <Alert>
                  <CheckCircle2 />
                  <AlertTitle>Purchase submitted</AlertTitle>
                  <AlertDescription>
                    <a
                      className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                      href={getTestnetExplorerTransactionUrl(latestHash)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View transaction
                      <ExternalLink className="size-3.5" />
                    </a>
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    buyCoins.isPending ||
                    availableQuery.isLoading ||
                    !availableQuery.data ||
                    values.amount.trim().length === 0 ||
                    values.address.trim().length === 0
                  }
                >
                  {buyCoins.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wallet />
                  )}
                  {estimatedPrice !== null
                    ? `Buy for ${formatUsdAmount(estimatedPrice)}`
                    : "Buy testnet GRAM"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faucet supply</CardTitle>
            <CardDescription>Updated every 30 seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            {availableQuery.isLoading ? (
              <div className="grid gap-3">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-44" />
              </div>
            ) : null}

            {availableQuery.data ? (
              <div className="grid gap-4">
                <Metric
                  label="Available"
                  value={`${formatTonAmount(availableQuery.data.balance)} GRAM`}
                />
                <Metric
                  label="Price"
                  value={`${formatUsdAmount(
                    availableQuery.data.usd_per_testnet_ton
                  )} per GRAM`}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <PaymentDetailsDialog
        open={Boolean(pendingPurchase)}
        pendingPurchase={pendingPurchase}
        loading={buyCoins.isPending}
        onOpenChange={(open) => {
          if (!open && !buyCoins.isPending) {
            setPendingPurchase(null)
          }
        }}
        onConfirm={confirmPurchase}
      />
    </div>
  )
}

function PaymentDetailsDialog({
  open,
  pendingPurchase,
  loading,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  pendingPurchase: PendingPurchase | null
  loading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>
            Confirm the testnet GRAM purchase before charging this project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-md border bg-muted/20 p-4 text-sm">
          <DetailRow
            label="Amount"
            value={
              pendingPurchase
                ? `${formatTonAmount(pendingPurchase.amountNano)} GRAM`
                : "-"
            }
          />
          <DetailRow
            label="Recipient"
            value={pendingPurchase?.address ?? "-"}
            mono
          />
          <DetailRow
            label="Price"
            value={
              pendingPurchase?.price !== null &&
              pendingPurchase?.price !== undefined
                ? formatUsdAmount(pendingPurchase.price)
                : "-"
            }
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!pendingPurchase || loading} onClick={onConfirm}>
            {loading ? <Loader2 className="animate-spin" /> : <Wallet />}
            Confirm purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_minmax(0,1fr)]">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "break-all font-mono text-xs" : "font-medium"}>
        {value}
      </span>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function validateForm(values: FaucetFormValues, availableNano?: number) {
  const errors: FaucetFormErrors = {}
  const requestedNano = parseTonToNano(values.amount)

  if (values.amount.trim().length === 0) {
    errors.amount = "Amount is required."
  } else if (requestedNano === null || requestedNano <= 0) {
    errors.amount = "Enter a positive amount with up to 9 decimals."
  } else if (requestedNano < 1_000_000_000) {
    errors.amount = "Amount must be at least 1 GRAM."
  } else if (availableNano !== undefined && requestedNano > availableNano) {
    errors.amount = "Amount exceeds available faucet supply."
  }

  if (values.address.trim().length === 0) {
    errors.address = "Recipient address is required."
  } else if (!isTonAddress(values.address)) {
    errors.address = "Enter a valid TON address."
  }

  return errors
}
