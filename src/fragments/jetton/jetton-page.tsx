import copyToClipboard from "copy-to-clipboard"
import { type FormEvent, useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  Plus,
  Search,
  Send,
  WalletCards,
} from "lucide-react"

import type { DTOAccount, DTOMintlessJetton } from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useSelectedProject } from "@/hooks/use-project"
import {
  DEFAULT_JETTON_DECIMALS,
  fromDecimals,
  prepareJettonDeploy,
  type JettonPreparedDeploy,
} from "@/lib/ton/jetton-deploy"

import {
  useCheckMintlessJettonMutation,
  useJettonsByOwnerMutation,
  useMintlessJettonConfigQuery,
  usePaidMintlessJettonsQuery,
} from "@/utils/jetton/jetton-queries"
import {
  formatNumber,
  formatUsdAmount,
  getExplorerAccountUrl,
  getJettonErrorMessage,
  isTonAddress,
  normalizeTonAddress,
  normalizeTonAddressToAddress,
} from "@/utils/jetton/jetton-utils"

export function JettonPage() {
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const configQuery = useMintlessJettonConfigQuery()
  const paidQuery = usePaidMintlessJettonsQuery()
  const paidJettons = paidQuery.data ?? []

  if (projectLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (projectError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Projects could not be loaded</AlertTitle>
        <AlertDescription>
          {getJettonErrorMessage(projectError)}
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WalletCards />
          </EmptyMedia>
          <EmptyTitle>Select or create a project</EmptyTitle>
          <EmptyDescription>
            Jetton services are configured per TON Console project.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Jetton"
        description="Manage mintless indexing checks and prepare minter metadata assets. Mint a standard jetton from a connected wallet, or prepare the transaction details before sending."
      />

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/jetton/minter">
            <Search />
            Minter
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/jetton/minter">
            <Plus />
            New jetton
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <CardHeader>
            <CardTitle>Mintless jettons</CardTitle>
            <CardDescription>
              Check existing mintless jettons and review paid jettons for this
              project.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Metric
              label="Paid jettons"
              value={
                paidQuery.isLoading
                  ? "Loading"
                  : formatNumber(paidJettons.length)
              }
            />
            <Metric
              label="Price per jetton"
              value={
                configQuery.isLoading
                  ? "Loading"
                  : configQuery.data
                    ? formatUsdAmount(configQuery.data.usd_price_per_jetton)
                    : "-"
              }
            />
          </CardContent>
        </Card>

        <JettonDeploymentSummary />
      </div>

      {configQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Mintless config unavailable</AlertTitle>
          <AlertDescription>
            {getJettonErrorMessage(configQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="mintless">
        <TabsList>
          <TabsTrigger value="mintless">Mintless</TabsTrigger>
          <TabsTrigger value="minter">Minter helpers</TabsTrigger>
        </TabsList>

        <TabsContent value="mintless" className="grid gap-4">
          <MintlessCheckCard />
          <PaidMintlessCard
            isLoading={paidQuery.isLoading}
            isError={paidQuery.isError}
            error={paidQuery.error}
            jettons={paidJettons}
          />
        </TabsContent>

        <TabsContent value="minter" className="grid gap-4">
          <JettonDeployCard />
          <OwnerJettonsCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function JettonMinterPage() {
  return (
    <div className="grid gap-5">
      <PageHeader
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            New Jetton
            <Badge variant="secondary">BETA</Badge>
          </span>
        }
        description="Prepare metadata, derive the minter contract address, and mint the jetton with TonConnect."
        actions={<TonConnectButton />}
      />

      <JettonDeployCard />
    </div>
  )
}

export function JettonMinterViewPage() {
  const { address } = useParams<{ address: string }>()
  const decodedAddress = safeDecodeURIComponent(address ?? "")
  const normalizedAddress = isTonAddress(decodedAddress)
    ? normalizeTonAddress(decodedAddress)
    : null
  const checkJetton = useCheckMintlessJettonMutation()

  useEffect(() => {
    checkJetton.reset()

    if (normalizedAddress) {
      checkJetton.mutate(normalizedAddress)
    }
  }, [normalizedAddress])

  if (!normalizedAddress) {
    return (
      <div className="grid gap-5">
        <Button asChild variant="ghost" size="sm" className="w-fit px-0">
          <Link to="/jetton/minter">
            <ArrowLeft />
            Back to minter
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Invalid jetton address</AlertTitle>
          <AlertDescription>
            The route parameter is not a valid TON address.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit px-0">
          <Link to="/jetton/minter">
            <ArrowLeft />
            Back to minter
          </Link>
        </Button>
        <PageHeader
          title="Jetton"
          description="Address validation and Console service checks for this jetton minter address."
          actions={<TonConnectButton />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jetton address</CardTitle>
          <CardDescription>
            The address is valid and normalized for Console API requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-sm font-medium">Normalized address</div>
            <div className="mt-1 font-mono text-xs break-all text-muted-foreground">
              {normalizedAddress}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href={getExplorerAccountUrl(normalizedAddress)}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink />
                Open explorer
              </a>
            </Button>
            <CopyButton
              value={normalizedAddress}
              label="Copy normalized jetton address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Console service check</CardTitle>
          <CardDescription>
            Uses the existing jetton check endpoint when available in this
            project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkJetton.isPending ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 animate-spin" />
              Checking jetton
            </div>
          ) : null}

          {checkJetton.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Jetton check failed</AlertTitle>
              <AlertDescription>
                {getJettonErrorMessage(checkJetton.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          {checkJetton.isSuccess ? (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Jetton check completed</AlertTitle>
              <AlertDescription>
                Console accepted this address for the available jetton service
                check.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function JettonDeploymentSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment</CardTitle>
        <CardDescription>
          Standard minter deployment is available in the Minter tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Metric label="Deploy value" value="0.25 GRAM" />
        <Button asChild className="w-full" variant="outline">
          <Link to="/jetton/minter">
            <Coins />
            Create jetton
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

type JettonDeployFormState = {
  name: string
  symbol: string
  decimals: string
  mint: string
  description: string
  image: string
}

type JettonDeployFieldErrors = Partial<
  Record<keyof JettonDeployFormState, string>
>

const defaultDeployForm: JettonDeployFormState = {
  name: "",
  symbol: "",
  decimals: String(DEFAULT_JETTON_DECIMALS),
  mint: "",
  description: "",
  image: "",
}

function JettonDeployCard() {
  const formId = "jetton-deploy-form"
  const userAddress = useTonAddress()
  const { open: openConnectModal } = useTonConnectModal()
  const [tonConnect] = useTonConnectUI()
  const [form, setForm] = useState(defaultDeployForm)
  const [fieldErrors, setFieldErrors] = useState<JettonDeployFieldErrors>({})
  const [preparedDeploy, setPreparedDeploy] =
    useState<JettonPreparedDeploy | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const setField = (field: keyof JettonDeployFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setPreparedDeploy(null)
  }

  const validateDeployForm = () => {
    const nextErrors: JettonDeployFieldErrors = {}
    const decimals = Number(form.decimals)

    if (!form.name.trim()) {
      nextErrors.name = "Name is required."
    }
    if (!form.symbol.trim()) {
      nextErrors.symbol = "Symbol is required."
    }
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
      nextErrors.decimals = "Enter an integer from 0 to 255."
    }
    try {
      const mintAmount = fromDecimals(
        form.mint,
        Number.isInteger(decimals) ? decimals : 0
      )
      if (mintAmount <= 0n) {
        nextErrors.mint = "Mint amount must be greater than zero."
      }
    } catch (error) {
      nextErrors.mint =
        error instanceof Error ? error.message : "Enter a valid mint amount."
    }
    if (form.image.trim() && !isHttpLikeUrl(form.image)) {
      nextErrors.image = "Use an http, https, or ipfs URL."
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const metadata = {
    name: form.name.trim(),
    symbol: form.symbol.trim(),
    description: form.description.trim() || undefined,
    decimals: form.decimals.trim(),
    image: form.image.trim() || undefined,
  }

  const prepareDeploy = async () => {
    if (!validateDeployForm()) {
      return null
    }

    if (!userAddress) {
      toast.error("Connect a wallet to prepare the mint transaction")
      openConnectModal()
      return null
    }

    setIsPreparing(true)
    try {
      const decimals = Number(form.decimals)
      const prepared = await prepareJettonDeploy({
        owner: normalizeTonAddressToAddress(userAddress),
        amountToMint: fromDecimals(form.mint, decimals),
        onchainMetaData: metadata,
        queryId: getDeployJettonQueryId(),
      })
      setPreparedDeploy(prepared)
      toast.success("Mint transaction prepared")
      return prepared
    } catch (error) {
      toast.error(getJettonErrorMessage(error))
      return null
    } finally {
      setIsPreparing(false)
    }
  }

  const submitDeploy = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userAddress) {
      openConnectModal()
      return
    }

    setIsSending(true)
    try {
      const prepared = preparedDeploy ?? (await prepareDeploy())
      if (!prepared) {
        return
      }

      await tonConnect.sendTransaction(prepared.request)
      toast.success("Mint transaction sent", {
        description:
          "Open the derived address in the explorer to track activation.",
      })
    } catch (error) {
      toast.error(getJettonErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  const pending = isPreparing || isSending

  return (
    <Card id={formId}>
      <CardHeader>
        <CardTitle>Mint jetton</CardTitle>
        <CardDescription>
          Create metadata, derive the minter address, and send the mint
          transaction with TonConnect.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <div className="text-sm font-medium">Connected wallet</div>
            <div className="font-mono text-xs break-all text-muted-foreground">
              {userAddress || "No wallet connected"}
            </div>
          </div>
          <TonConnectButton />
        </div>

        <form className="grid gap-4" noValidate onSubmit={submitDeploy}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={Boolean(fieldErrors.name)}>
              <FieldLabel htmlFor="jetton-name">Name</FieldLabel>
              <Input
                id="jetton-name"
                value={form.name}
                autoComplete="off"
                disabled={pending}
                placeholder="Example Token"
                onChange={(event) => setField("name", event.target.value)}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field data-invalid={Boolean(fieldErrors.symbol)}>
              <FieldLabel htmlFor="jetton-symbol">Symbol</FieldLabel>
              <Input
                id="jetton-symbol"
                value={form.symbol}
                autoComplete="off"
                disabled={pending}
                placeholder="JET"
                onChange={(event) => setField("symbol", event.target.value)}
              />
              <FieldError>{fieldErrors.symbol}</FieldError>
            </Field>

            <Field data-invalid={Boolean(fieldErrors.decimals)}>
              <FieldLabel htmlFor="jetton-decimals">Decimals</FieldLabel>
              <Input
                id="jetton-decimals"
                value={form.decimals}
                inputMode="numeric"
                disabled={pending}
                onChange={(event) => setField("decimals", event.target.value)}
              />
              <FieldDescription>Most jettons use 9 decimals.</FieldDescription>
              <FieldError>{fieldErrors.decimals}</FieldError>
            </Field>

            <Field data-invalid={Boolean(fieldErrors.mint)}>
              <FieldLabel htmlFor="jetton-mint">Initial mint</FieldLabel>
              <Input
                id="jetton-mint"
                value={form.mint}
                inputMode="decimal"
                disabled={pending}
                placeholder="1000000"
                onChange={(event) => setField("mint", event.target.value)}
              />
              <FieldDescription>
                Minted to the connected wallet.
              </FieldDescription>
              <FieldError>{fieldErrors.mint}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="jetton-description">Description</FieldLabel>
            <Textarea
              id="jetton-description"
              value={form.description}
              className="min-h-24"
              disabled={pending}
              onChange={(event) => setField("description", event.target.value)}
            />
          </Field>

          <Field data-invalid={Boolean(fieldErrors.image)}>
            <FieldLabel htmlFor="jetton-image">Logo URL</FieldLabel>
            <Input
              id="jetton-image"
              value={form.image}
              autoComplete="off"
              disabled={pending}
              placeholder="https://..."
              onChange={(event) => setField("image", event.target.value)}
            />
            <FieldDescription>
              Optional public URL for the jetton logo.
            </FieldDescription>
            <FieldError>{fieldErrors.image}</FieldError>
          </Field>

          {preparedDeploy ? (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Prepared minter address</AlertTitle>
              <AlertDescription className="grid gap-2">
                <AddressLink account={preparedDeploy.address.toString()} />
                <span className="text-xs text-muted-foreground">
                  Sending will mint this jetton by deploying the minter contract
                  with state init and sending the initial supply to your wallet.
                  This UI does not mark the contract as active until the chain
                  accepts the transaction.
                </span>
                <span className="flex flex-wrap gap-2">
                  <LabeledCopyButton
                    value={preparedDeploy.stateInit}
                    label="Copy state init"
                  />
                  <LabeledCopyButton
                    value={preparedDeploy.payload}
                    label="Copy payload"
                  />
                  <LabeledCopyButton
                    value={JSON.stringify(preparedDeploy.request, null, 2)}
                    label="Copy transaction JSON"
                  />
                </span>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={prepareDeploy}
            >
              {isPreparing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Eye />
              )}
              Preview transaction
            </Button>
            <Button type="submit" disabled={pending}>
              {isSending ? <Loader2 className="animate-spin" /> : <Send />}
              {userAddress ? "Mint" : "Connect wallet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function MintlessCheckCard() {
  const [account, setAccount] = useState("")
  const [error, setError] = useState<string | undefined>()
  const [checkedAccount, setCheckedAccount] = useState<string | null>(null)
  const checkJetton = useCheckMintlessJettonMutation()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextError = validateAddress(account, "Jetton address is required.")
    setError(nextError)

    if (nextError) {
      return
    }

    const normalizedAccount = normalizeTonAddress(account)
    checkJetton.mutate(normalizedAccount, {
      onSuccess: () => setCheckedAccount(normalizedAccount),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check mintless jetton</CardTitle>
        <CardDescription>
          Verify whether a mintless jetton account exists in the service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" noValidate onSubmit={submit}>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="mintless-account">Jetton address</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="mintless-account"
                value={account}
                autoComplete="off"
                placeholder="0:da6b1b..."
                disabled={checkJetton.isPending}
                onChange={(event) => {
                  setAccount(event.target.value)
                  setError(undefined)
                  setCheckedAccount(null)
                  checkJetton.reset()
                }}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={checkJetton.isPending}
              >
                {checkJetton.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
                Check
              </Button>
            </div>
            <FieldDescription>
              Enter a raw or user-friendly TON jetton account address.
            </FieldDescription>
            <FieldError>{error}</FieldError>
          </Field>
        </form>

        {checkJetton.isError ? (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle />
            <AlertTitle>Jetton check failed</AlertTitle>
            <AlertDescription>
              {getJettonErrorMessage(checkJetton.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        {checkJetton.isSuccess && checkedAccount ? (
          <Alert className="mt-4">
            <CheckCircle2 />
            <AlertTitle>Mintless jetton found</AlertTitle>
            <AlertDescription>
              <AddressLink account={checkedAccount} />
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

function PaidMintlessCard({
  isLoading,
  isError,
  error,
  jettons,
}: {
  isLoading: boolean
  isError: boolean
  error: unknown
  jettons: DTOMintlessJetton[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid mintless jettons</CardTitle>
        <CardDescription>
          Mintless jettons already paid for this selected project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" />
            Loading jettons
          </div>
        ) : null}

        {isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Paid jettons could not be loaded</AlertTitle>
            <AlertDescription>{getJettonErrorMessage(error)}</AlertDescription>
          </Alert>
        ) : null}

        {!isLoading && !isError && jettons.length === 0 ? (
          <Empty className="min-h-64">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WalletCards />
              </EmptyMedia>
              <EmptyTitle>No paid mintless jettons</EmptyTitle>
              <EmptyDescription>
                Paid mintless jettons will appear here after purchase.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {jettons.length > 0 ? <PaidMintlessTable jettons={jettons} /> : null}
      </CardContent>
    </Card>
  )
}

function PaidMintlessTable({ jettons }: { jettons: DTOMintlessJetton[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead className="w-32 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jettons.map((jetton) => (
            <TableRow key={jetton.account}>
              <TableCell>
                <AddressLink account={jetton.account} />
              </TableCell>
              <TableCell className="text-right">
                <CopyButton
                  value={jetton.account}
                  label="Copy jetton address"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function OwnerJettonsCard() {
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | undefined>()
  const [items, setItems] = useState<DTOAccount[]>([])
  const ownerJettons = useJettonsByOwnerMutation()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextError = validateAddress(address, "Owner address is required.")
    setError(nextError)

    if (nextError) {
      return
    }

    ownerJettons.mutate(normalizeTonAddress(address), {
      onSuccess: (nextItems) => setItems(nextItems),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jettons by owner</CardTitle>
        <CardDescription>
          Look up minter jetton accounts owned by a wallet address.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form className="grid gap-4" noValidate onSubmit={submit}>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="owner-address">Owner address</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="owner-address"
                value={address}
                autoComplete="off"
                placeholder="EQ..."
                disabled={ownerJettons.isPending}
                onChange={(event) => {
                  setAddress(event.target.value)
                  setError(undefined)
                  setItems([])
                  ownerJettons.reset()
                }}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={ownerJettons.isPending}
              >
                {ownerJettons.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
                Search
              </Button>
            </div>
            <FieldDescription>
              Raw and user-friendly TON addresses are accepted.
            </FieldDescription>
            <FieldError>{error}</FieldError>
          </Field>
        </form>

        {ownerJettons.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Owner lookup failed</AlertTitle>
            <AlertDescription>
              {getJettonErrorMessage(ownerJettons.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        {ownerJettons.isSuccess && items.length === 0 ? (
          <Empty className="min-h-48">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>No jettons found</EmptyTitle>
              <EmptyDescription>
                This owner did not return any minter jettons.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="[&_tr:hover]:!bg-transparent">
                <TableRow>
                  <TableHead>Jetton account</TableHead>
                  <TableHead className="w-32 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.account}>
                    <TableCell>
                      <AddressLink account={item.account} />
                    </TableCell>
                    <TableCell className="text-right">
                      <CopyButton
                        value={item.account}
                        label="Copy jetton account"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </CardContent>
    </Card>
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

function AddressLink({ account }: { account: string }) {
  return (
    <a
      className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
      href={getExplorerAccountUrl(account)}
      rel="noreferrer"
      target="_blank"
    >
      <span className="truncate font-mono text-xs">{account}</span>
      <ExternalLink className="size-3.5 shrink-0" />
    </a>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      onClick={() => {
        copyToClipboard(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

function LabeledCopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => {
        copyToClipboard(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  )
}

function validateAddress(value: string, requiredMessage: string) {
  if (value.trim().length === 0) {
    return requiredMessage
  }

  if (!isTonAddress(value)) {
    return "Enter a valid TON address."
  }

  return undefined
}

function isHttpLikeUrl(value: string) {
  return /^(https?:\/\/|ipfs:\/\/)\S+$/i.test(value.trim())
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function getDeployJettonQueryId() {
  try {
    return BigInt(import.meta.env.VITE_DEPLOY_JETTON_QUERY_ID ?? 0)
  } catch {
    return 0n
  }
}
