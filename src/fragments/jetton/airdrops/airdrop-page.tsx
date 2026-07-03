import { type FormEvent, useEffect, useId, useMemo, useState } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  TonConnectButton,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react"
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileUp,
  Gift,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Table2,
  Trash2,
  WalletCards,
} from "lucide-react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { toast } from "sonner"

import type { DTOJettonAirdrop } from "@/api/api.generated"
import { client as tonApi } from "@/api/tonapi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Card,
  CardAction,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSelectedProject } from "@/hooks/use-project"
import {
  formatTonAddressBounceable,
  formatTonAddressNonBounceable,
  isTonAddress,
  normalizeTonAddress,
} from "@/utils/jetton/jetton-utils"
import { useHeaderBreadcrumbOverride } from "@/routes/layouts/authenticated-layout"

import {
  useAirdropConfigQuery,
  useAirdropDetailQuery,
  useCreateAirdropMutation,
  useJettonAirdropsQuery,
  useSwitchAirdropClaimMutation,
  useUploadAirdropFileMutation,
} from "@/utils/jetton/airdrops/airdrop-queries"
import {
  formatAirdropAmount,
  formatAirdropDate,
  formatNanoTonAmount,
  createAirdropTonConnectTransaction,
  getAirdropOnChainAmount,
  getAirdropOnChainMessages,
  getAirdropOnChainStatus,
  getAirdropErrorMessage,
  getAirdropSetupStatus,
  getAirdropStatusLabel,
  getClaimStatusLabel,
  getDistributorStatusLabel,
  isWalletW5,
  type AirdropOnChainStatus,
} from "@/utils/jetton/airdrops/airdrop-utils"

type AirdropDetailData = NonNullable<
  ReturnType<typeof useAirdropDetailQuery>["data"]
>

type LoadedAirdropDetailData = AirdropDetailData & {
  airdrop: NonNullable<AirdropDetailData["airdrop"]>
}

type CreateFormState = {
  name: string
  admin: string
  jetton: string
  minCommission: string
  vestingEnabled: boolean
  vesting: VestingUnlockFormState[]
}

type VestingUnlockFormState = {
  unlockTime: string
  fraction: string
}

type CreateFormErrors = Partial<
  Record<keyof CreateFormState | "vesting", string>
>

const initialCreateFormState: CreateFormState = {
  name: "",
  admin: "",
  jetton: "",
  minCommission: "0.15",
  vestingEnabled: false,
  vesting: [],
}

export function JettonAirdropsPage() {
  const navigate = useNavigate()
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const airdropsQuery = useJettonAirdropsQuery()
  const configQuery = useAirdropConfigQuery()

  const airdrops = useMemo(
    () =>
      [...(airdropsQuery.data ?? [])].sort(
        (left, right) => right.date_create - left.date_create
      ),
    [airdropsQuery.data]
  )

  if (projectLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-32" />
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
          {getAirdropErrorMessage(projectError)}
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Gift />
          </EmptyMedia>
          <EmptyTitle>Select or create a project</EmptyTitle>
          <EmptyDescription>
            Jetton airdrops are configured per TON Console project.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Jetton airdrops"
        description="A service for mass distribution of jettons."
        actions={
          <>
            <Button variant="outline" asChild>
              <a
                href="https://docs.tonconsole.com/tonconsole/jettons/airdrop"
                target="_blank"
                rel="noreferrer"
              >
                <BookOpen />
                Documentation
              </a>
            </Button>
            <Button asChild>
              <Link to="/jetton/airdrops/create">
                <Plus />
                New Airdrop
              </Link>
            </Button>
          </>
        }
      />

      {configQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Airdrop config unavailable</AlertTitle>
          <AlertDescription>
            {getAirdropErrorMessage(configQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      <AirdropsHistoryCard
        airdrops={airdrops}
        isLoading={airdropsQuery.isLoading}
        isError={airdropsQuery.isError}
        error={airdropsQuery.error}
        onOpen={(apiId) => navigate(`/jetton/airdrops/${apiId}`)}
        onRefresh={() => airdropsQuery.refetch()}
      />
    </div>
  )
}

export function JettonAirdropCreatePage() {
  const navigate = useNavigate()
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const configQuery = useAirdropConfigQuery()

  if (projectLoading || configQuery.isLoading) {
    return <LoadingState />
  }

  if (projectError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Projects could not be loaded</AlertTitle>
        <AlertDescription>
          {getAirdropErrorMessage(projectError)}
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="New Airdrop"
        description="Fill in the details, register the service airdrop, then upload recipients on the airdrop page."
        actions={
          <>
            <TonConnectButton />
          </>
        }
      />

      {configQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Airdrop config unavailable</AlertTitle>
          <AlertDescription>
            {getAirdropErrorMessage(configQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,620px)_minmax(280px,1fr)]">
        <CreateAirdropCard
          requireTerms
          onCreated={(apiId) => navigate(`/jetton/airdrops/${apiId}`)}
        />
        <CreateInfoCard />
      </div>
    </div>
  )
}

export function JettonAirdropDetailPage() {
  const params = useParams()
  const airdropId = params.id
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const airdropsQuery = useJettonAirdropsQuery()

  const airdrop = useMemo(
    () => airdropsQuery.data?.find((item) => item.api_id === airdropId),
    [airdropId, airdropsQuery.data]
  )
  const breadcrumbItems = useMemo(
    () =>
      airdrop
        ? [
            { title: "Jetton", href: "/jetton" },
            { title: "Airdrops", href: "/jetton/airdrops" },
            { title: airdrop.name },
          ]
        : null,
    [airdrop]
  )

  useHeaderBreadcrumbOverride(breadcrumbItems)

  if (!airdropId) {
    return <Navigate to="/jetton/airdrops" replace />
  }

  if (projectLoading || airdropsQuery.isLoading) {
    return <LoadingState />
  }

  if (projectError || airdropsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Airdrop could not be loaded</AlertTitle>
        <AlertDescription>
          {getAirdropErrorMessage(projectError ?? airdropsQuery.error)}
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return <Navigate to="/dashboard" replace />
  }

  if (!airdrop) {
    return (
      <Card>
        <CardContent className="py-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Gift />
              </EmptyMedia>
              <EmptyTitle>Airdrop not found</EmptyTitle>
              <EmptyDescription>
                It may belong to another project or it may have been removed.
              </EmptyDescription>
            </EmptyHeader>
            <Button asChild>
              <Link to="/jetton/airdrops">Back to airdrops</Link>
            </Button>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title={airdrop.name}
        description={<span className="font-mono text-xs">{airdrop.api_id}</span>}
        actions={<AirdropClaimAppButton airdrop={airdrop} />}
      />
      <AirdropSetupCard airdrop={airdrop} />
    </div>
  )
}

function AirdropsHistoryCard({
  airdrops,
  isLoading,
  isError,
  error,
  onOpen,
  onRefresh,
}: {
  airdrops: DTOJettonAirdrop[]
  isLoading: boolean
  isError: boolean
  error: unknown
  onOpen: (id: string) => void
  onRefresh: () => void
}) {
  return (
    <Card>
      <CardHeader className="has-data-[slot=card-action]:grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <div className="grid gap-1">
          <CardTitle>Airdrop history</CardTitle>
          <CardDescription>
            Airdrops registered in the current TON Console project.
          </CardDescription>
        </div>
        <CardAction className="col-start-1 row-start-3 row-span-1 justify-self-start sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:justify-self-end">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw />
            Refresh
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Airdrops could not be loaded</AlertTitle>
            <AlertDescription>{getAirdropErrorMessage(error)}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : null}

        {!isLoading && !airdrops.length && !isError ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Gift />
              </EmptyMedia>
              <EmptyTitle>No airdrops yet</EmptyTitle>
              <EmptyDescription>
                Create an airdrop to register it in this project.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!isLoading && airdrops.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="[&_tr:hover]:!bg-transparent">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airdrops.map((airdrop) => (
                  <TableRow
                    key={airdrop.id}
                    className="cursor-pointer"
                    onClick={() => onOpen(airdrop.api_id)}
                  >
                    <TableCell className="font-medium">
                      {airdrop.name}
                    </TableCell>
                    <TableCell>
                      {formatAirdropDate(airdrop.date_create)}
                    </TableCell>
                    <TableCell>v{airdrop.version}</TableCell>
                    <TableCell className="max-w-72 truncate font-mono text-xs">
                      <span className="inline-flex max-w-full items-center gap-1">
                        <span className="truncate">{airdrop.api_id}</span>
                        <CopyTextButton
                          value={airdrop.api_id}
                          label="Copy airdrop API ID"
                        />
                      </span>
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

function CreateAirdropCard({
  onCreated,
  requireTerms = false,
}: {
  onCreated: (apiId: string) => void
  requireTerms?: boolean
}) {
  const connectedAddress = useTonAddress()
  const formId = useId()
  const [form, setForm] = useState<CreateFormState>({
    ...initialCreateFormState,
    admin: connectedAddress,
  })
  const [errors, setErrors] = useState<CreateFormErrors>({})
  const [termsAccepted, setTermsAccepted] = useState(!requireTerms)
  const [riskAccepted, setRiskAccepted] = useState(!requireTerms)
  const [isCheckingJetton, setIsCheckingJetton] = useState(false)
  const createAirdrop = useCreateAirdropMutation()
  const termsReady = termsAccepted && riskAccepted

  useEffect(() => {
    if (!connectedAddress) {
      return
    }

    setForm((current) =>
      current.admin.trim() ? current : { ...current, admin: connectedAddress }
    )
  }, [connectedAddress])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!termsReady) {
      toast.error("Accept the airdrop terms before continuing")
      return
    }

    const nextErrors = validateCreateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    setIsCheckingJetton(true)
    const jettonExists = await checkJettonMaster(form.jetton)
    setIsCheckingJetton(false)

    if (!jettonExists) {
      setErrors((current) => ({ ...current, jetton: "Jetton not found" }))
      return
    }

    createAirdrop.mutate(
      {
        name: form.name.trim(),
        admin: normalizeTonAddress(form.admin),
        jetton: normalizeTonAddress(form.jetton),
        minCommission: form.minCommission.trim(),
        vesting: form.vestingEnabled
          ? form.vesting.map((item) => ({
              unlockTime: Math.floor(
                parseVestingDate(item.unlockTime)!.getTime() / 1000
              ),
              fraction: Math.round(Number(item.fraction) * 100),
            }))
          : undefined,
      },
      {
        onSuccess: (airdrop) => {
          toast.success("Airdrop created")
          onCreated(airdrop.api_id)
          setForm({ ...initialCreateFormState, admin: connectedAddress })
          setTermsAccepted(!requireTerms)
          setRiskAccepted(!requireTerms)
        },
        onError: (error) => toast.error(getAirdropErrorMessage(error)),
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New airdrop</CardTitle>
        <CardDescription>
          Creates the service airdrop first, then registers it in the current
          project history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id={formId} className="grid gap-4" noValidate onSubmit={submit}>
          <div className="grid gap-4">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
              <Input
                id={`${formId}-name`}
                value={form.name}
                placeholder="Community rewards"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
              {errors.name ? <FieldError>{errors.name}</FieldError> : null}
            </Field>

            <Field data-invalid={Boolean(errors.minCommission)}>
              <FieldLabel htmlFor={`${formId}-commission`}>
                Minimum commission, GRAM
              </FieldLabel>
              <Input
                id={`${formId}-commission`}
                value={form.minCommission}
                inputMode="decimal"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    minCommission: event.target.value,
                  }))
                }
              />
              <FieldDescription>
                Amount of GRAM required to receive Jettons. Min: 0.15 GRAM and
                Max: 5 GRAM.
              </FieldDescription>
              {errors.minCommission ? (
                <FieldError>{errors.minCommission}</FieldError>
              ) : null}
            </Field>
          </div>

          <Field data-invalid={Boolean(errors.admin)}>
            <FieldLabel htmlFor={`${formId}-admin`}>Admin wallet</FieldLabel>
            <Input
              id={`${formId}-admin`}
              value={form.admin}
              placeholder="UQ..."
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  admin: event.target.value,
                }))
              }
            />
            <FieldDescription>
              Defaults to the connected wallet address when available.
            </FieldDescription>
            {errors.admin ? <FieldError>{errors.admin}</FieldError> : null}
          </Field>

          <Field data-invalid={Boolean(errors.jetton)}>
            <FieldLabel htmlFor={`${formId}-jetton`}>
              Jetton master address
            </FieldLabel>
            <Input
              id={`${formId}-jetton`}
              value={form.jetton}
              placeholder="EQ..."
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  jetton: event.target.value,
                }))
              }
            />
            {errors.jetton ? <FieldError>{errors.jetton}</FieldError> : null}
          </Field>

          <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
            <label className="flex items-center gap-3 text-sm font-medium">
              <Checkbox
                checked={form.vestingEnabled}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    vestingEnabled: checked === true,
                    vesting:
                      checked === true
                        ? current.vesting.length
                          ? current.vesting
                          : createEmptyVestingUnlocks()
                        : [],
                  }))
                }
              />
              <span>Use vesting</span>
            </label>

            {form.vestingEnabled ? (
              <div className="grid gap-3">
                <FieldDescription>
                  New date must be later than the previous one and date must be
                  no earlier than tomorrow and percentages must sum up to 100
                </FieldDescription>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_auto]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Unlock date
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Percent
                  </span>
                  <span className="sr-only">Actions</span>
                </div>

                {form.vesting.map((unlock, index) => (
                  <div
                    key={index}
                    className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_auto]"
                  >
                    <VestingDatePicker
                      value={unlock.unlockTime}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          vesting: current.vesting.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, unlockTime: value }
                              : item
                          ),
                        }))
                      }
                    />
                    <Input
                      value={unlock.fraction}
                      inputMode="decimal"
                      placeholder="Percent"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          vesting: current.vesting.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, fraction: event.target.value }
                              : item
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={form.vesting.length === 1}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          vesting: current.vesting.filter(
                            (_item, itemIndex) => itemIndex !== index
                          ),
                        }))
                      }
                      aria-label="Remove unlock date"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}

                {errors.vesting ? (
                  <p className="text-sm font-medium text-destructive">
                    {errors.vesting}
                  </p>
                ) : null}

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        vesting: [
                          ...current.vesting,
                          createEmptyVestingUnlock(),
                        ],
                      }))
                    }
                  >
                    <Plus />
                    Add unlock date
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {requireTerms ? (
            <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                />
                <span>
                  I have read and agree with the{" "}
                  <a
                    className="font-medium text-foreground underline underline-offset-4"
                    href="https://docs.tonconsole.com/tonconsole/jettons/airdrop/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Airdrop Terms of Use
                  </a>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={riskAccepted}
                  onCheckedChange={(checked) =>
                    setRiskAccepted(checked === true)
                  }
                />
                <span>
                  I have read and agree with the{" "}
                  <a
                    className="font-medium text-foreground underline underline-offset-4"
                    href="https://docs.tonconsole.com/tonconsole/jettons/airdrop"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Airdop T&amp;C Terms
                  </a>
                  .
                </span>
              </label>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                createAirdrop.isPending || isCheckingJetton || !termsReady
              }
            >
              {createAirdrop.isPending || isCheckingJetton ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Create airdrop
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function VestingDatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseVestingDate(value)
  const minDate = getTomorrowStart()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="justify-start px-3 font-normal"
        >
          <CalendarDays />
          <span className="truncate">
            {selectedDate
              ? formatVestingDateDisplay(selectedDate)
              : "Select date"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          disabled={(date) => date < minDate}
          onSelect={(date) => {
            if (!date) {
              return
            }

            onChange(formatVestingDateInput(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function AirdropClaimAppButton({ airdrop }: { airdrop: DTOJettonAirdrop }) {
  return (
    <Button variant="outline" asChild>
      <a
        href={`https://tonkeeper.github.io/airdrop-reference-dapp/?airdropId=${encodeURIComponent(
          airdrop.api_id
        )}&testnet=${import.meta.env.VITE_TESTNET === "true"}`}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink />
        Test claim
      </a>
    </Button>
  )
}

function AirdropSetupCard({ airdrop }: { airdrop: DTOJettonAirdrop }) {
  if (isLegacyAirdropRecord(airdrop)) {
    return <LegacyAirdropCard airdrop={airdrop} />
  }

  return <ModernAirdropSetupCard airdrop={airdrop} />
}

function ModernAirdropSetupCard({ airdrop }: { airdrop: DTOJettonAirdrop }) {
  const detailQuery = useAirdropDetailQuery(airdrop)
  const loadedDetail = detailQuery.data?.airdrop
    ? (detailQuery.data as LoadedAirdropDetailData)
    : null
  const status = loadedDetail
    ? getAirdropSetupStatus(
        loadedDetail.airdrop,
        loadedDetail.distributors
      )
    : null
  const canUploadRecipients = !loadedDetail || status === "need_file"
  const canShowOnChainActions = loadedDetail
    ? canManageAirdropOnChain(loadedDetail)
    : false

  return (
    <Card>
      <CardContent className="grid gap-4">
        {status ? (
          <div>
            <Badge variant="secondary">{getAirdropStatusLabel(status)}</Badge>
          </div>
        ) : null}

        {status ? (
          <p className="text-sm text-muted-foreground">
            {getAirdropStatusDescription(status)}
          </p>
        ) : null}

        {detailQuery.isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-44" />
          </div>
        ) : null}

        {detailQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Airdrop details could not be loaded</AlertTitle>
            <AlertDescription>
              {getAirdropErrorMessage(detailQuery.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        {detailQuery.data && !loadedDetail ? (
          <>
            <Alert>
              <AlertCircle />
              <AlertTitle>Airdrop service data is not initialized</AlertTitle>
              <AlertDescription>
                The Console record exists, but the airdrop API has not returned
                detail data for this ID yet. Upload a recipients CSV to continue
                setup.
              </AlertDescription>
            </Alert>
            {canUploadRecipients ? (
              <UploadRecipientsForm airdrop={airdrop} />
            ) : null}
          </>
        ) : null}

        {loadedDetail ? (
          <>
            <AirdropSummary detail={loadedDetail} />
            {status === "processing" ? <AirdropFileProcessingAlert /> : null}
            {canUploadRecipients ? (
              <>
                <Separator />
                <UploadRecipientsForm airdrop={airdrop} />
              </>
            ) : null}
            {canShowOnChainActions ? (
              <>
                <Separator />
                <AirdropActions detail={loadedDetail} />
                <Separator />
                <DistributorsTable distributors={loadedDetail.distributors} />
              </>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function LegacyAirdropCard({ airdrop }: { airdrop: DTOJettonAirdrop }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legacy airdrop</CardTitle>
        <CardDescription>
          This airdrop was created with the legacy v1 flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Status" value="Legacy" />
          <Metric label="Version" value={`v${airdrop.version}`} />
          <Metric
            label="Created"
            value={formatAirdropDate(airdrop.date_create)}
          />
          <Metric label="ID" value={airdrop.api_id} title={airdrop.api_id} />
        </div>
        <Alert>
          <AlertCircle />
          <AlertTitle>Legacy details</AlertTitle>
          <AlertDescription>
            Detailed setup data for legacy airdrops is not available from the
            current service API. Use the claim app to view the public claim
            flow.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function isLegacyAirdropRecord(airdrop: DTOJettonAirdrop) {
  return airdrop.version === 1
}

function CreateInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Before you start</CardTitle>
        <CardDescription>
          This flow uses the migrated service API and prepares on-chain
          transactions from the generated distributor messages.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <p>
          After creation, upload the recipient CSV on the detail page. The API
          will process recipients and expose distributor contract messages.
        </p>
        <Alert>
          <WalletCards />
          <AlertTitle>Admin wallet required</AlertTitle>
          <AlertDescription>
            Connect the same W5 wallet used as the airdrop admin. If a wallet
            cannot send the full batch, the detail page can copy or download the
            prepared TonConnect payload.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function AirdropSummary({
  detail,
}: {
  detail: LoadedAirdropDetailData
}) {
  const status = getAirdropSetupStatus(detail.airdrop, detail.distributors)
  const jetton = detail.airdrop.jetton
  const adminAddress = formatTonAddressNonBounceable(detail.airdrop.admin)

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="Status" value={getAirdropStatusLabel(status)} />
      <Metric
        label="Claim method"
        value={getClaimStatusLabel(detail.airdrop.clam_status)}
      />
      <Metric
        label="Recipients"
        value={formatMetricNumber(detail.airdrop.recipients)}
      />
      <Metric
        label="Total amount"
        value={
          jetton
            ? formatAirdropAmount(
                detail.airdrop.total_amount,
                jetton.decimals,
                jetton.symbol
              )
            : "-"
        }
      />
      <Metric label="Jetton" value={jetton?.symbol ?? "-"} />
      <Metric
        label="Shards"
        value={formatMetricNumber(detail.airdrop.shards)}
      />
      <Metric
        label="File"
        value={detail.airdrop.file_name ?? detail.airdrop.file_hash ?? "-"}
      />
      <Metric
        label="Admin"
        value={shortenAddress(adminAddress)}
        title={adminAddress}
      />
      {detail.airdrop.upload_error ? (
        <Alert variant="destructive" className="sm:col-span-2 lg:col-span-4">
          <AlertCircle />
          <AlertTitle>Upload error</AlertTitle>
          <AlertDescription>{detail.airdrop.upload_error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

function UploadRecipientsForm({ airdrop }: { airdrop: DTOJettonAirdrop }) {
  const inputId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [useExternalFile, setUseExternalFile] = useState(false)
  const [fileUrl, setFileUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const uploadFile = useUploadAirdropFileMutation()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (useExternalFile) {
      if (!isValidUrl(fileUrl)) {
        setError("Incorrect file URL")
        return
      }
    } else {
      const fileError = getRecipientsFileValidationError(file)
      if (fileError) {
        setError(fileError)
        return
      }
    }

    setProgress(useExternalFile ? null : 0)
    uploadFile.mutate(
      {
        id: airdrop.api_id,
        file: useExternalFile ? undefined : file ?? undefined,
        url: useExternalFile ? fileUrl.trim() : undefined,
        onProgress: useExternalFile ? undefined : setProgress,
      },
      {
        onSuccess: () => {
          toast.success("Recipients file uploaded")
          setFile(null)
          setFileUrl("")
          setProgress(null)
        },
        onError: (error) => {
          if (useExternalFile) {
            setProgress(null)
          }
          setError(getAirdropErrorMessage(error))
        },
      }
    )
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="flex items-center gap-3 text-sm font-medium">
        <Checkbox
          checked={useExternalFile}
          onCheckedChange={(checked) => {
            setUseExternalFile(checked === true)
            setError(null)
            setProgress(null)
          }}
        />
        <span>File size more than 100 MB</span>
      </label>

      {useExternalFile ? (
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Field>
            <FieldLabel htmlFor={`${inputId}-url`}>File URL</FieldLabel>
            <Input
              id={`${inputId}-url`}
              value={fileUrl}
              placeholder="https://example.com/airdrop.csv"
              onChange={(event) => setFileUrl(event.target.value)}
            />
            <FieldDescription>
              Provide a publicly reachable CSV file URL for files over 100 MB.
            </FieldDescription>
          </Field>
          <div className="flex items-end">
            <UploadButton pending={uploadFile.isPending} disabled={!fileUrl} />
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Field>
            <FieldLabel htmlFor={inputId}>Recipients CSV</FieldLabel>
            <Input
              id={inputId}
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => {
                setError(null)
                setFile(event.target.files?.[0] ?? null)
              }}
            />
            <FieldDescription>
              Upload the withdrawals file before deployment.
            </FieldDescription>
          </Field>
          <div className="flex items-end">
            <UploadButton pending={uploadFile.isPending} />
          </div>
        </div>
      )}

      {progress !== null ? (
        <div className="grid gap-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {progress}% of the file uploaded
          </p>
        </div>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>File could not be uploaded</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <AirdropFileRequirements />
    </form>
  )
}

function UploadButton({
  pending,
  disabled,
}: {
  pending: boolean
  disabled?: boolean
}) {
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? <Loader2 className="animate-spin" /> : <FileUp />}
      Upload file
    </Button>
  )
}

function AirdropFileRequirements() {
  const downloadExample = () => {
    const data = [
      ["recipient", "amount"],
      [
        "0:c28bb05cd8433090056ef266531ecb933a0d9339619d2cd4304483594cdd15c5",
        "11000000000",
      ],
    ]
    const csvContent = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "example.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-3 rounded-md border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">File requirements</h3>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={downloadExample}
          aria-label="Download example CSV"
        >
          <Download />
        </Button>
      </div>
      <div className="grid gap-1 text-sm text-muted-foreground">
        <p>1. CSV format with a comma delimiter;</p>
        <p>2. Contain a header in the format: recipient, amount;</p>
        <p>
          3. Token amount in minimal indivisible units without considering
          decimals (example: 1000000 for 1 USDT, decimals=6). The value must be
          positive, and decimal points are not allowed;
        </p>
        <p>
          4. Recipient wallet addresses in user-friendly or raw format, with no
          duplicate addresses allowed. More information in{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href="https://docs.tonconsole.com/tonconsole/jettons/airdrop"
            target="_blank"
            rel="noreferrer"
          >
            documentation
          </a>
          ;
        </p>
        <p>5. File size up to 10,000,000 records</p>
      </div>
    </div>
  )
}

function AirdropFileProcessingAlert() {
  return (
    <Alert>
      <Loader2 className="animate-spin" />
      <AlertTitle>Preparing data for distribution</AlertTitle>
      <AlertDescription>
        Preparing data for distribution. This is a lengthy process and will take
        approximately 7 minutes per 1 million addresses. You can close the page
        and check later.
      </AlertDescription>
    </Alert>
  )
}

function getRecipientsFileValidationError(file: File | null) {
  if (!file) {
    return "Choose a CSV file first"
  }

  const maxSize = 1024 * 1024 * 100
  const minSize = 1000
  if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
    return "Invalid file type"
  }
  if (file.size < minSize) {
    return "Minimum 20 wallets"
  }
  if (file.size > maxSize) {
    return "Maximum 100 MB"
  }

  return null
}

function isValidUrl(value: string) {
  if (!value.trim()) {
    return false
  }

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function canManageAirdropOnChain(
  detail: LoadedAirdropDetailData
) {
  const status = getAirdropSetupStatus(detail.airdrop, detail.distributors)
  return (
    !detail.airdrop.upload_error &&
    status !== "need_file" &&
    status !== "processing"
  )
}

function AirdropActions({
  detail,
}: {
  detail: LoadedAirdropDetailData
}) {
  const wallet = useTonWallet()
  const { open: openConnectModal } = useTonConnectModal()
  const [tonConnect] = useTonConnectUI()
  const [isSending, setIsSending] = useState(false)
  const [awaitingOnChainStatus, setAwaitingOnChainStatus] =
    useState<AirdropOnChainStatus | null>(null)
  const switchClaim = useSwitchAirdropClaimMutation()
  const status = getAirdropSetupStatus(detail.airdrop, detail.distributors)
  const onChainStatus = getAirdropOnChainStatus(detail.distributors)
  const onChainMessages = getAirdropOnChainMessages(
    detail.distributors,
    onChainStatus
  )
  const onChainAmount = getAirdropOnChainAmount(
    detail.distributors,
    onChainStatus
  )
  const transaction = createAirdropTonConnectTransaction(onChainMessages)
  const jetton = detail.airdrop.jetton
  const action = getOnChainActionCopy(onChainStatus, jetton?.symbol ?? "jettons")
  const connectedAddress = wallet?.account.address
  const isAdminWallet = addressesEqual(connectedAddress, detail.airdrop.admin)
  const walletIsW5 = isWalletW5(wallet?.account.walletStateInit)
  const maxMessages = getWalletMaxMessages(wallet)
  const exceedsWalletBatchLimit =
    typeof maxMessages === "number" && onChainMessages.length > maxMessages
  const canSendOnChain =
    Boolean(wallet && isAdminWallet && walletIsW5) &&
    Boolean(action) &&
    onChainMessages.length > 0 &&
    !exceedsWalletBatchLimit
  const canSwitchClaim = status === "claim_active" || status === "claim_stopped"
  const canShowOnChainOperation = status !== "claim_active"
  const nextStatus = detail.airdrop.clam_status === "opened" ? "closed" : "open"
  const isAwaitingOnChainUpdate = Boolean(awaitingOnChainStatus)
  const canShowOnChainActionButton =
    Boolean(action) && onChainMessages.length > 0

  useEffect(() => {
    if (awaitingOnChainStatus && onChainStatus !== awaitingOnChainStatus) {
      setAwaitingOnChainStatus(null)
    }
  }, [awaitingOnChainStatus, onChainStatus])

  const sendOnChainTransaction = async () => {
    if (isSending || isAwaitingOnChainUpdate) {
      return
    }

    if (!wallet) {
      openConnectModal()
      return
    }

    if (!isAdminWallet) {
      toast.error("Connect the admin wallet for this airdrop")
      return
    }

    if (!walletIsW5) {
      toast.error("Connect a W5 wallet to send airdrop transactions")
      return
    }

    if (!action || !onChainMessages.length) {
      toast.error("No on-chain transaction is available for this state")
      return
    }

    if (exceedsWalletBatchLimit) {
      toast.error("Connected wallet cannot send this many messages at once")
      return
    }

    setIsSending(true)
    try {
      await tonConnect.sendTransaction(transaction)
      toast.success(`${action.sentLabel} transaction sent`)
      setAwaitingOnChainStatus(onChainStatus)
    } catch (error) {
      toast.error(getAirdropErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="grid gap-4">
      {canShowOnChainOperation ? (
        <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="grid gap-1">
              <h3 className="text-sm font-medium">On-chain operation</h3>
              <p className="text-sm text-muted-foreground">
                {action
                  ? action.description
                  : "No deploy, top-up, block, or withdrawal transaction is currently required."}
              </p>
            </div>
            <Badge variant={action ? "secondary" : "outline"}>
              {getOnChainStatusLabel(onChainStatus)}
            </Badge>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Messages" value={String(onChainMessages.length)} />
            <Metric
              label="Attached GRAM"
              value={formatNanoTonAmount(onChainAmount?.ton)}
            />
            <Metric
              label="Required jettons"
              value={
                onChainAmount?.jetton !== undefined && jetton
                  ? formatAirdropAmount(
                      onChainAmount.jetton.toString(),
                      jetton.decimals,
                      jetton.symbol
                    )
                  : "-"
              }
            />
            <Metric
              label="Wallet batch limit"
              value={maxMessages ? String(maxMessages) : "Unknown"}
            />
          </div>

          <AdminWalletHint
            admin={detail.airdrop.admin}
            connectedAddress={connectedAddress}
            isAdminWallet={isAdminWallet}
            walletIsW5={walletIsW5}
            walletName={wallet?.device.appName}
          />

          {exceedsWalletBatchLimit ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Batch is too large for this wallet</AlertTitle>
              <AlertDescription>
                The API prepared {onChainMessages.length} messages, but the
                connected wallet advertises a limit of {maxMessages}. Use a
                wallet that supports this batch size.
              </AlertDescription>
            </Alert>
          ) : null}

          {canShowOnChainActionButton || !wallet ? (
            <div className="flex flex-wrap gap-2">
              {canShowOnChainActionButton ? (
                <Button
                  type="button"
                  disabled={
                    !canSendOnChain || isSending || isAwaitingOnChainUpdate
                  }
                  onClick={sendOnChainTransaction}
                >
                  {isSending || isAwaitingOnChainUpdate ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  {isAwaitingOnChainUpdate
                    ? "Waiting for status"
                    : action?.buttonLabel ?? "Send transaction"}
                </Button>
              ) : null}
              {!wallet ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openConnectModal()}
                >
                  <WalletCards />
                  Connect admin wallet
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {canSwitchClaim ? (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={nextStatus === "open" ? "default" : "secondary"}
            disabled={switchClaim.isPending}
            onClick={() =>
              switchClaim.mutate(
                { id: detail.record.api_id, nextStatus },
                {
                  onSuccess: () =>
                    toast.success(
                      nextStatus === "open" ? "Claims opened" : "Claims paused"
                    ),
                  onError: (error) => toast.error(getAirdropErrorMessage(error)),
                }
              )
            }
          >
            {switchClaim.isPending ? (
              <Loader2 className="animate-spin" />
            ) : nextStatus === "open" ? (
              <Play />
            ) : (
              <Pause />
            )}
            {nextStatus === "open" ? "Open claims" : "Pause claims"}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function AdminWalletHint({
  admin,
  connectedAddress,
  isAdminWallet,
  walletIsW5,
  walletName,
}: {
  admin: string
  connectedAddress: string | undefined
  isAdminWallet: boolean
  walletIsW5: boolean
  walletName: string | undefined
}) {
  const adminAddress = formatTonAddressNonBounceable(admin)
  const connectedWalletAddress = connectedAddress
    ? formatTonAddressNonBounceable(connectedAddress)
    : undefined

  if (!connectedAddress) {
    return (
      <Alert>
        <WalletCards />
        <AlertTitle>Connect admin wallet</AlertTitle>
        <AlertDescription>
          This airdrop is administered by {shortenAddress(adminAddress)}.
          Connect that W5 wallet to send prepared distributor transactions.
        </AlertDescription>
      </Alert>
    )
  }

  if (!isAdminWallet) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Wrong wallet connected</AlertTitle>
        <AlertDescription>
          Connected wallet{" "}
          {shortenAddress(connectedWalletAddress ?? connectedAddress)} does not
          match the airdrop admin {shortenAddress(adminAddress)}.
        </AlertDescription>
      </Alert>
    )
  }

  if (!walletIsW5) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>W5 wallet required</AlertTitle>
        <AlertDescription>
          {walletName ? `${walletName} is connected, but ` : ""}the connected
          wallet state init does not match the W5 wallet code hash required by
          the legacy airdrop flow.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <Check />
      <AlertTitle>Admin W5 wallet connected</AlertTitle>
      <AlertDescription>
        Prepared transactions will be sent from {shortenAddress(adminAddress)}.
      </AlertDescription>
    </Alert>
  )
}

function DistributorsTable({
  distributors,
}: {
  distributors: NonNullable<
    ReturnType<typeof useAirdropDetailQuery>["data"]
  >["distributors"]
}) {
  const [open, setOpen] = useState(false)

  if (!distributors.length) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Table2 />
          </EmptyMedia>
          <EmptyTitle>No distributors yet</EmptyTitle>
          <EmptyDescription>
            Distributors appear after the recipients file is processed.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="grid gap-3">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <span className="inline-flex items-center gap-2">
            <Table2 />
            Distributors
            <Badge variant="secondary">{distributors.length}</Badge>
          </span>
          <ChevronDown
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="[&_tr:hover]:!bg-transparent">
              <TableRow>
                <TableHead>Shard</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors.map((distributor) => {
                const account = distributor.account
                  ? formatTonAddressBounceable(distributor.account)
                  : ""

                return (
                  <TableRow key={`${distributor.shard}-${distributor.account}`}>
                    <TableCell>{distributor.shard}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDistributorStatusLabel(distributor.airdrop_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatMetricNumber(distributor.recipients)}
                    </TableCell>
                    <TableCell>{distributor.total_amount}</TableCell>
                    <TableCell className="max-w-72 font-mono text-xs">
                      <span className="inline-flex max-w-full items-center gap-1">
                        <span className="truncate">{account}</span>
                        {account ? (
                          <CopyTextButton
                            value={account}
                            label="Copy distributor account"
                          />
                        ) : null}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CopyTextButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        copyToClipboard(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

function Metric({
  label,
  value,
  title,
}: {
  label: string
  value: string
  title?: string
}) {
  return (
    <div className="grid min-w-0 gap-1 rounded-md border bg-muted/20 p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-semibold" title={title ?? value}>
        {value}
      </span>
    </div>
  )
}

function validateCreateForm(form: CreateFormState) {
  const errors: CreateFormErrors = {}

  if (!form.name.trim()) {
    errors.name = "Airdrop name is required."
  }

  if (!form.admin.trim()) {
    errors.admin = "Admin wallet is required."
  } else if (!isTonAddress(form.admin)) {
    errors.admin = "Enter a valid TON address."
  }

  if (!form.jetton.trim()) {
    errors.jetton = "Jetton master address is required."
  } else if (!isTonAddress(form.jetton)) {
    errors.jetton = "Enter a valid TON address."
  }

  const commission = Number(form.minCommission)
  if (!form.minCommission.trim()) {
    errors.minCommission = "Minimum commission is required."
  } else if (!Number.isFinite(commission)) {
    errors.minCommission = "Enter a valid GRAM amount."
  } else if (commission < 0.15) {
    errors.minCommission = "Minimum 0.15 GRAM."
  } else if (commission > 5) {
    errors.minCommission = "Maximum 5 GRAM."
  }

  if (form.vestingEnabled) {
    const vestingError = getVestingValidationError(form.vesting)

    if (vestingError) {
      errors.vesting = vestingError
    }
  }

  return errors
}

async function checkJettonMaster(address: string) {
  try {
    await tonApi.jettons.getJettonInfo(normalizeTonAddress(address))
    return true
  } catch {
    return false
  }
}

function createEmptyVestingUnlock(): VestingUnlockFormState {
  return { unlockTime: "", fraction: "" }
}

function createEmptyVestingUnlocks(): VestingUnlockFormState[] {
  return [createEmptyVestingUnlock(), createEmptyVestingUnlock()]
}

function getVestingValidationError(vesting: VestingUnlockFormState[]) {
  const hasDateError = vesting.some((unlock, index) => {
    if (!unlock.unlockTime) {
      return true
    }

    const currentDate = parseVestingDate(unlock.unlockTime)
    if (!currentDate) {
      return true
    }

    if (currentDate < getTomorrowStart()) {
      return true
    }

    if (index === 0) {
      return false
    }

    const previousDate = parseVestingDate(vesting[index - 1]?.unlockTime)
    return previousDate ? currentDate <= previousDate : false
  })

  const fractions = vesting.map((unlock) => Number(unlock.fraction))
  const hasZeroFraction = fractions.some(
    (fraction) => !Number.isFinite(fraction) || fraction <= 0
  )
  const totalFraction = fractions.reduce(
    (sum, fraction) => sum + (Number.isFinite(fraction) ? fraction : 0),
    0
  )
  const hasFractionError =
    hasZeroFraction || Math.round(totalFraction * 100) !== 10_000

  if (hasDateError && hasFractionError) {
    return "New date must be later than the previous one and date must be no earlier than tomorrow and percentages must sum up to 100"
  }

  if (hasDateError) {
    return "New date must be later than the previous one and date must be no earlier than tomorrow"
  }

  if (hasZeroFraction) {
    return "Percentage value must be greater than zero."
  }

  if (hasFractionError) {
    return "Percentages must sum up to 100"
  }

  return null
}

function getTomorrowStart() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return tomorrow
}

function parseVestingDate(value: string | undefined) {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return null
  }

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function formatVestingDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatVestingDateDisplay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(date)
}

function formatMetricNumber(value: number | undefined) {
  if (typeof value !== "number") {
    return "-"
  }

  return new Intl.NumberFormat(undefined).format(value)
}

function shortenAddress(value: string) {
  if (value.length <= 16) {
    return value
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

function addressesEqual(left: string | undefined, right: string | undefined) {
  if (!left || !right) {
    return false
  }

  try {
    return normalizeTonAddress(left) === normalizeTonAddress(right)
  } catch {
    return left === right
  }
}

function getWalletMaxMessages(wallet: ReturnType<typeof useTonWallet>) {
  const sendTransactionFeature = wallet?.device.features.find(
    (feature) =>
      typeof feature === "object" && feature.name === "SendTransaction"
  )

  if (
    sendTransactionFeature &&
    typeof sendTransactionFeature === "object" &&
    "maxMessages" in sendTransactionFeature &&
    typeof sendTransactionFeature.maxMessages === "number"
  ) {
    return sendTransactionFeature.maxMessages
  }

  return undefined
}

function getOnChainStatusLabel(status: AirdropOnChainStatus) {
  const labels: Record<AirdropOnChainStatus, string> = {
    waiting: "Waiting",
    deploy: "Deploy required",
    topup: "Top-up required",
    ready: "Ready to complete",
    block: "Blocked",
    withdraw_jetton: "Withdraw jettons",
    withdraw_ton: "Withdraw GRAM",
    withdraw_complete: "Withdraw complete",
  }

  return labels[status]
}

function getOnChainActionCopy(
  status: AirdropOnChainStatus,
  jettonSymbol: string | undefined
) {
  const symbol = jettonSymbol || "jettons"
  const copy: Partial<
    Record<
      AirdropOnChainStatus,
      { buttonLabel: string; sentLabel: string; description: string }
    >
  > = {
    deploy: {
      buttonLabel: "Deploy distributors",
      sentLabel: "Deploy",
      description:
        "Distributor contracts are ready. Send the deploy messages from the admin W5 wallet.",
    },
    topup: {
      buttonLabel: "Top up distributors",
      sentLabel: "Top-up",
      description:
        "Some distributor contracts need jettons. Send the prepared top-up messages from the admin W5 wallet.",
    },
    ready: {
      buttonLabel: "Complete airdrop",
      sentLabel: "Block",
      description:
        "The airdrop can be completed by sending block messages to ready distributors.",
    },
    withdraw_jetton: {
      buttonLabel: `Withdraw ${symbol}`,
      sentLabel: "Jetton withdrawal",
      description:
        "Blocked distributors have leftover jettons that can be withdrawn by the admin wallet.",
    },
    withdraw_ton: {
      buttonLabel: "Withdraw GRAM",
      sentLabel: "GRAM withdrawal",
      description:
        "Blocked distributors have leftover GRAM that can be withdrawn by the admin wallet.",
    },
  }

  return copy[status] ?? null
}

function getAirdropStatusDescription(
  status: ReturnType<typeof getAirdropSetupStatus>
) {
  const descriptions: Record<
    ReturnType<typeof getAirdropSetupStatus>,
    string
  > = {
    need_file: "Upload the file with recipients.",
    processing: "The recipients file is being processed.",
    need_deploy:
      "Distributor contracts are prepared. Use the on-chain operation panel to deploy or top up them.",
    claim_active:
      "Airdrop is ready. Claims are open and can be paused from this page.",
    claim_stopped: "Claims are paused and can be opened from this page.",
    blocked:
      "Distribution is blocked or completed. Use the on-chain operation panel if withdrawal messages are available.",
  }

  return descriptions[status]
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-32" />
      <Skeleton className="h-96" />
    </div>
  )
}
