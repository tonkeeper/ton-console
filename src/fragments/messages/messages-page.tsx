import { useId, useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  BellRing,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  MessageSquareText,
  PackagePlus,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  WalletCards,
  XCircle,
} from "lucide-react"

import type { DTOMessagesApp, DTOMessagesPackage } from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelectedProject } from "@/hooks/use-project"

import { MessageAppForm, MessagePushForm } from "./message-forms"
import {
  MESSAGE_VERIFICATION_FILE,
  getMessageAppFormDefaultValues,
  getMessagePushAddresses,
  getMessagePushFormDefaultValues,
  getMessageVerificationPayloadBody,
  getMessageVerificationUrl,
  validateMessageAppForm,
  validateMessagePushForm,
  valuesToMessageAppPayload,
  valuesToMessagePushPayload,
} from "@/utils/messages/message-form-utils"
import {
  getMessageErrorMessage,
  useBuyMessagesPackageMutation,
  useCreateMessagesAppMutation,
  useDeleteMessagesAppMutation,
  useMessagesAppsQuery,
  useMessagesBalanceQuery,
  useMessagesPackagesQuery,
  useMessagesStatsQuery,
  useMessagesTokenQuery,
  useRegenerateMessagesTokenMutation,
  useSendMessagesPushMutation,
  useVerifyMessagesAppMutation,
} from "@/utils/messages/message-queries"
import { useBillingHistoryQuery } from "@/utils/billing/billing-queries"
import type {
  MessageAppPayload,
  MessageAppFormValues,
  MessagePushFormValues,
} from "@/utils/messages/message-types"

const APP_MESSAGES_DOC_URL =
  "https://docs.tonconsole.com/tonconsole/tonkeeper-messages"

export function MessagesPage() {
  const {
    isLoading: projectLoading,
    error: projectError,
    selectedProject,
  } = useSelectedProject()
  const appsQuery = useMessagesAppsQuery()
  const apps = appsQuery.data ?? []
  const app = useMemo(
    () => apps.find((item) => item.verify) ?? apps[0] ?? null,
    [apps]
  )

  if (projectLoading) {
    return <MessagesLoading />
  }

  if (projectError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Projects could not be loaded</AlertTitle>
        <AlertDescription>
          {getMessageErrorMessage(projectError)}
        </AlertDescription>
      </Alert>
    )
  }

  if (!selectedProject) {
    return (
      <Empty className="min-h-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareText />
          </EmptyMedia>
          <EmptyTitle>Select or create a project</EmptyTitle>
          <EmptyDescription>
            Tonkeeper Messages are configured per project.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        title="Tonkeeper Messages"
        description="Register a dApp, manage the backend push token, and purchase message packages for Tonkeeper notifications."
        actions={
          <Button variant="outline" asChild>
            <a href={APP_MESSAGES_DOC_URL} target="_blank" rel="noreferrer">
              <BookOpen />
              Documentation
            </a>
          </Button>
        }
      />

      {appsQuery.isLoading ? <MessagesLoading /> : null}

      {appsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Messages setup could not be loaded</AlertTitle>
          <AlertDescription>
            {getMessageErrorMessage(appsQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {appsQuery.isSuccess && !app ? <MessagesSetupCard /> : null}

      {app ? (
        <>
          {!app.verify ? <UnverifiedAppAlert app={app} /> : null}
          <MessagesDashboard app={app} />
        </>
      ) : null}
    </div>
  )
}

function MessagesSetupCard() {
  const formId = useId()
  const createApp = useCreateMessagesAppMutation()
  const verifyApp = useVerifyMessagesAppMutation()
  const [isResolvingManifest, setIsResolvingManifest] = useState(false)
  const [values, setValues] = useState<MessageAppFormValues>(
    getMessageAppFormDefaultValues()
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof MessageAppFormValues, string>>
  >({})
  const [pendingPayload, setPendingPayload] = useState<string | null>(null)
  const [validUntil, setValidUntil] = useState<number | null>(null)
  const [createdAppUrl, setCreatedAppUrl] = useState("")
  const verificationBody = pendingPayload
    ? getMessageVerificationPayloadBody(pendingPayload)
    : ""
  const verificationUrl = pendingPayload
    ? getMessageVerificationUrl(createdAppUrl)
    : ""

  const submit = async () => {
    const nextErrors = validateMessageAppForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsResolvingManifest(true)

    let payload: MessageAppPayload
    try {
      payload = await valuesToMessageAppPayload(values)
    } catch (error) {
      setErrors({
        manifestUrl:
          error instanceof Error
            ? error.message
            : "Cannot fetch TonConnect manifest.",
      })
      setIsResolvingManifest(false)
      return
    }

    setIsResolvingManifest(false)

    createApp.mutate(payload, {
      onSuccess: (data) => {
        setPendingPayload(data.payload)
        setValidUntil(data.valid_until)
        setCreatedAppUrl(payload.url)
        toast.success("Messages app created")
      },
      onError: (error) => toast.error(getMessageErrorMessage(error)),
    })
  }

  const verify = () => {
    if (!pendingPayload) {
      return
    }

    verifyApp.mutate(pendingPayload, {
      onSuccess: () => {
        setPendingPayload(null)
        setValidUntil(null)
        toast.success("Messages app verified")
      },
      onError: (error) => toast.error(getMessageErrorMessage(error)),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register app</CardTitle>
        <CardDescription>
          Create a Tonkeeper Messages app for this project and verify ownership.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={
          pendingPayload
            ? "grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]"
            : "grid gap-5"
        }
      >
        <div className="grid max-w-2xl gap-4">
          <MessageAppForm
            formId={formId}
            values={values}
            errors={errors}
            disabled={
              isResolvingManifest ||
              createApp.isPending ||
              Boolean(pendingPayload)
            }
            onChange={setValues}
            onSubmit={submit}
          />
          {createApp.isError ? (
            <p className="text-sm text-destructive">
              {getMessageErrorMessage(createApp.error)}
            </p>
          ) : null}
          <div>
            <Button
              form={formId}
              type="submit"
              disabled={
                isResolvingManifest ||
                createApp.isPending ||
                Boolean(pendingPayload)
              }
            >
              {isResolvingManifest || createApp.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Register
            </Button>
          </div>
        </div>

        {pendingPayload ? (
          <div className="self-start rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background">
                <ShieldCheck className="size-4 text-muted-foreground" />
              </span>
              Verification
            </div>
            <div className="mt-4 grid gap-3">
              <p className="text-sm text-muted-foreground">
                Create a JSON file named{" "}
                <button
                  type="button"
                  className="font-mono text-foreground underline-offset-4 hover:underline"
                  onClick={() => {
                    copyToClipboard(MESSAGE_VERIFICATION_FILE)
                    toast.success("File name copied")
                  }}
                >
                  {MESSAGE_VERIFICATION_FILE}
                </button>{" "}
                on your app domain, paste this content, then confirm
                verification here.
              </p>
              <CopyBlock
                title="Payload file content"
                value={verificationBody}
              />
              {verificationUrl ? (
                <p className="text-sm text-muted-foreground">
                  Make sure the file is available at{" "}
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {verificationUrl}
                  </a>
                  .
                </p>
              ) : null}
              {validUntil ? (
                <p className="text-xs text-muted-foreground">
                  Valid until {formatUnixDate(validUntil)}.
                </p>
              ) : null}
              {verifyApp.isError ? (
                <p className="text-sm text-destructive">
                  {getMessageErrorMessage(verifyApp.error)}
                </p>
              ) : null}
              <Button onClick={verify} disabled={verifyApp.isPending}>
                {verifyApp.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}
                Verify app
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function UnverifiedAppAlert({ app }: { app: DTOMessagesApp }) {
  const deleteApp = useDeleteMessagesAppMutation()

  return (
    <Alert>
      <AlertCircle />
      <AlertTitle>{app.name} is not verified</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Create setup returned a verification payload for this app. If that
          payload is unavailable, delete the app and register again.
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={deleteApp.isPending}
          onClick={() =>
            deleteApp.mutate(app.id, {
              onSuccess: () => toast.success("Messages app deleted"),
              onError: (error) => toast.error(getMessageErrorMessage(error)),
            })
          }
        >
          {deleteApp.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash2 />
          )}
          Delete app
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function MessagesDashboard({ app }: { app: DTOMessagesApp }) {
  return (
    <div className="grid gap-5">
      <AppSummaryCard app={app} />
      <StatsGrid appId={app.id} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <TokenCard app={app} />
        <PackagesCard />
      </div>
      <PushTestCard app={app} />
    </div>
  )
}

function AppSummaryCard({ app }: { app: DTOMessagesApp }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteApp = useDeleteMessagesAppMutation()

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-11 rounded-lg">
            <AvatarImage src={app.image} alt="" />
            <AvatarFallback className="rounded-lg">
              {getInitials(app.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate">{app.name}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2">
              <span>ID {app.id}</span>
              <span className="text-muted-foreground/60">/</span>
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 items-center gap-1 underline-offset-4 hover:underline"
              >
                <span className="truncate">{app.url}</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            </CardDescription>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <Badge variant={app.verify ? "default" : "outline"}>
            {app.verify ? "Verified" : "Pending"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created {formatTimestamp(app.date_create)}.
        </p>
      </CardContent>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {app.name}</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the Messages app registration and invalidates its
              token.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteApp.isError ? (
            <p className="text-sm text-destructive">
              {getMessageErrorMessage(deleteApp.error)}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteApp.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteApp.isPending}
              onClick={() =>
                deleteApp.mutate(app.id, {
                  onSuccess: () => {
                    setDeleteOpen(false)
                    toast.success("Messages app deleted")
                  },
                  onError: (error) =>
                    toast.error(getMessageErrorMessage(error)),
                })
              }
            >
              {deleteApp.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function StatsGrid({ appId }: { appId: number }) {
  const balanceQuery = useMessagesBalanceQuery()
  const statsQuery = useMessagesStatsQuery(appId)

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MessagesBalanceMetric
        balance={balanceQuery.data}
        isLoading={balanceQuery.isLoading}
        error={balanceQuery.error}
      />
      <MetricCard
        title="All users"
        value={
          statsQuery.isLoading
            ? undefined
            : formatNumber(statsQuery.data?.users ?? 0)
        }
        description="Tonkeeper connected users"
        icon={MessageSquareText}
        error={statsQuery.error}
      />
      <MetricCard
        title="Notifications on"
        value={
          statsQuery.isLoading
            ? undefined
            : formatNumber(statsQuery.data?.enable_notifications ?? 0)
        }
        description="Users allowing pushes"
        icon={BellRing}
        error={statsQuery.error}
      />
      <MetricCard
        title="Sent in 7 days"
        value={
          statsQuery.isLoading
            ? undefined
            : formatNumber(statsQuery.data?.sent_in_week ?? 0)
        }
        description="Recent delivered messages"
        icon={Send}
        error={statsQuery.error}
      />
    </section>
  )
}

function MessagesBalanceMetric({
  balance,
  isLoading,
  error,
}: {
  balance?: number
  isLoading: boolean
  error: unknown
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <WalletCards className="size-4 text-muted-foreground" />
          Available messages
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {error ? (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="size-4" />
            Unavailable
          </div>
        ) : isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div
            className={
              balance === 0
                ? "text-2xl font-semibold text-destructive"
                : "text-2xl font-semibold"
            }
          >
            {formatNumber(balance ?? 0)}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Project message balance
          </p>
          <MessagesRefillDialog
            trigger={
              <Button type="button" size="sm" disabled={Boolean(error)}>
                <Plus />
                Refill
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  error,
}: {
  title: string
  value?: string
  description: string
  icon: typeof WalletCards
  error: unknown
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {error ? (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="size-4" />
            Unavailable
          </div>
        ) : value !== undefined ? (
          <div className="text-2xl font-semibold">{value}</div>
        ) : (
          <Skeleton className="h-8 w-24" />
        )}
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function TokenCard({ app }: { app: DTOMessagesApp }) {
  const tokenQuery = useMessagesTokenQuery(app.verify ? app.id : null)
  const regenerateToken = useRegenerateMessagesTokenMutation()
  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const token = tokenQuery.data ?? ""

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend token</CardTitle>
        <CardDescription>
          Use this token only from your backend when sending push notifications.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            disabled={!app.verify || tokenQuery.isLoading}
            onClick={() => setRegenerateOpen(true)}
          >
            <RefreshCw />
            Regenerate
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4">
        {tokenQuery.isLoading ? <Skeleton className="h-20 w-full" /> : null}
        {tokenQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Token could not be loaded</AlertTitle>
            <AlertDescription>
              {getMessageErrorMessage(tokenQuery.error)}
            </AlertDescription>
          </Alert>
        ) : null}
        {token ? <CopyBlock value={token} /> : null}
        <p className="text-sm text-muted-foreground">
          This token provides access to the Messages API. Keep it on your
          backend and send it in the Authorization header.
        </p>
        <Tabs defaultValue="single">
          <TabsList>
            <TabsTrigger value="single">Message user</TabsTrigger>
            <TabsTrigger value="all">Message all</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="mt-3">
            <CopyBlock
              value={`curl -X POST https://tonconsole.com/api/v1/services/messages/push \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${token}' \\
  -d '{"message":"my_message","addresses":["EQ..."],"link":"https://app.example.com/event"}'`}
            />
            <ApiBodyNotes includeAddress />
          </TabsContent>
          <TabsContent value="all" className="mt-3">
            <CopyBlock
              value={`curl -X POST https://tonconsole.com/api/v1/services/messages/push \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${token}' \\
  -d '{"message":"my_message","link":"https://app.example.com/event"}'`}
            />
            <ApiBodyNotes />
          </TabsContent>
        </Tabs>
        <Button type="button" variant="outline" asChild>
          <a href={APP_MESSAGES_DOC_URL} target="_blank" rel="noreferrer">
            <BookOpen />
            Open docs
            <ExternalLink />
          </a>
        </Button>
      </CardContent>

      <AlertDialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <RefreshCw />
            </AlertDialogMedia>
            <AlertDialogTitle>Generate a new token?</AlertDialogTitle>
            <AlertDialogDescription>
              The previous token will stop working after regeneration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={regenerateToken.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={regenerateToken.isPending}
              onClick={() =>
                regenerateToken.mutate(app.id, {
                  onSuccess: () => {
                    setRegenerateOpen(false)
                    toast.success("Token regenerated")
                  },
                  onError: (error) =>
                    toast.error(getMessageErrorMessage(error)),
                })
              }
            >
              {regenerateToken.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <RefreshCw />
              )}
              Generate
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function ApiBodyNotes({
  includeAddress = false,
}: {
  includeAddress?: boolean
}) {
  return (
    <div className="mt-3 grid gap-2 rounded-lg border bg-muted/25 p-3 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">Body properties</p>
      {includeAddress ? (
        <p>
          <code className="rounded bg-muted px-1 py-0.5">address</code> or{" "}
          <code className="rounded bg-muted px-1 py-0.5">addresses</code>{" "}
          targets wallet recipients.
        </p>
      ) : null}
      <p>
        <code className="rounded bg-muted px-1 py-0.5">message</code> is the
        notification call to action.
      </p>
      <p>
        <code className="rounded bg-muted px-1 py-0.5">link</code> opens in
        Tonkeeper dApp Browser.
      </p>
    </div>
  )
}

function PackagesCard() {
  const packagesQuery = useMessagesPackagesQuery()
  const [selectedPackage, setSelectedPackage] =
    useState<DTOMessagesPackage | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message packages</CardTitle>
        <CardDescription>
          Purchase one-time packages for this project.
        </CardDescription>
        <CardAction>
          <MessagesRefillDialog
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Plus />
                Refill
              </Button>
            }
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        {packagesQuery.isLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}
        {packagesQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Packages could not be loaded</AlertTitle>
            <AlertDescription>
              {getMessageErrorMessage(packagesQuery.error)}
            </AlertDescription>
          </Alert>
        ) : null}
        {packagesQuery.isSuccess && packagesQuery.data.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackagePlus />
              </EmptyMedia>
              <EmptyTitle>No packages available</EmptyTitle>
              <EmptyDescription>Check back later.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {packagesQuery.isSuccess && packagesQuery.data.length > 0 ? (
          <Table>
            <TableHeader className="[&_tr:hover]:!bg-transparent">
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-1" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {packagesQuery.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{formatNumber(item.limits)}</TableCell>
                  <TableCell className="text-right">
                    {formatUsd(item.usd_price)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPackage(item)}
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>

      <Dialog
        open={Boolean(selectedPackage)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPackage(null)
          }
        }}
      >
        <PackagePurchaseDialogContent
          selectedPackage={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      </Dialog>
    </Card>
  )
}

function MessagesRefillDialog({ trigger }: { trigger: ReactNode }) {
  const packagesQuery = useMessagesPackagesQuery()
  const billingQuery = useBillingHistoryQuery({ limit: 1 })
  const [open, setOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState("")
  const [confirmingPackage, setConfirmingPackage] =
    useState<DTOMessagesPackage | null>(null)
  const packages = packagesQuery.data ?? []
  const selectedPackage =
    packages.find((item) => String(item.id) === selectedPackageId) ??
    packages[0] ??
    null
  const projectBalanceUsd = billingQuery.data?.balances.usdt.total
  const paymentDeficit = getPaymentDeficitUsd(
    selectedPackage?.usd_price,
    projectBalanceUsd
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) {
          setConfirmingPackage(null)
          setSelectedPackageId("")
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {confirmingPackage ? (
        <PackagePurchaseDialogContent
          selectedPackage={confirmingPackage}
          onClose={() => setOpen(false)}
        />
      ) : (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Refill messages</DialogTitle>
            <DialogDescription>
              Choose a one-time Messages package for this project.
            </DialogDescription>
          </DialogHeader>
          {packagesQuery.isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : null}
          {packagesQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Packages could not be loaded</AlertTitle>
              <AlertDescription>
                {getMessageErrorMessage(packagesQuery.error)}
              </AlertDescription>
            </Alert>
          ) : null}
          {packagesQuery.isSuccess && packages.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackagePlus />
                </EmptyMedia>
                <EmptyTitle>No packages available</EmptyTitle>
                <EmptyDescription>Check back later.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}
          {packages.length > 0 ? (
            <RadioGroup
              value={selectedPackage ? String(selectedPackage.id) : ""}
              onValueChange={setSelectedPackageId}
            >
              {packages.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={String(item.id)} className="mt-1" />
                  <span className="grid flex-1 gap-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold">
                        {formatUsd(item.usd_price)}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(item.limits)} messages
                    </span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          ) : null}
          {selectedPackage && billingQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : null}
          {selectedPackage && paymentDeficit > 0 ? (
            <Alert>
              <AlertCircle />
              <AlertTitle>Not enough USDT balance</AlertTitle>
              <AlertDescription>
                Add at least {formatUsd(paymentDeficit)} to the project balance
                before purchasing {selectedPackage.name}.
              </AlertDescription>
            </Alert>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            {paymentDeficit > 0 ? (
              <Button type="button" asChild>
                <Link to="/billing" onClick={() => setOpen(false)}>
                  <WalletCards />
                  Top up balance
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!selectedPackage || billingQuery.isLoading}
                onClick={() => setConfirmingPackage(selectedPackage)}
              >
                <CircleDollarSign />
                Choose
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

function PackagePurchaseDialogContent({
  selectedPackage,
  onClose,
}: {
  selectedPackage: DTOMessagesPackage | null
  onClose: () => void
}) {
  const buyPackage = useBuyMessagesPackageMutation()
  const billingQuery = useBillingHistoryQuery({ limit: 1 })
  const projectBalanceUsd = billingQuery.data?.balances.usdt.total
  const paymentDeficit = getPaymentDeficitUsd(
    selectedPackage?.usd_price,
    projectBalanceUsd
  )

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Purchase details</DialogTitle>
        <DialogDescription>
          Confirm the one-time Messages package purchase.
        </DialogDescription>
      </DialogHeader>
      {selectedPackage ? (
        <div className="grid gap-3 rounded-lg border p-4 text-sm">
          <DetailRow label="Package" value={selectedPackage.name} />
          <DetailRow
            label="Includes"
            value={`${formatNumber(selectedPackage.limits)} messages`}
          />
          <DetailRow label="Type" value="One-time payment" />
          <DetailRow
            label="Price"
            value={formatUsd(selectedPackage.usd_price)}
          />
          <DetailRow
            label="USDT balance"
            value={
              billingQuery.isLoading
                ? "Loading..."
                : projectBalanceUsd === undefined
                  ? "Unavailable"
                  : formatUsd(projectBalanceUsd)
            }
          />
        </div>
      ) : null}
      {paymentDeficit > 0 ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>Top up project balance</AlertTitle>
          <AlertDescription>
            This package needs {formatUsd(paymentDeficit)} more USDT before it
            can be purchased.
          </AlertDescription>
        </Alert>
      ) : null}
      {buyPackage.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Purchase failed</AlertTitle>
          <AlertDescription>
            {getMessageErrorMessage(buyPackage.error)}
          </AlertDescription>
        </Alert>
      ) : null}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={buyPackage.isPending}
          onClick={onClose}
        >
          Cancel
        </Button>
        {paymentDeficit > 0 ? (
          <Button type="button" asChild>
            <Link to="/billing" onClick={onClose}>
              <WalletCards />
              Top up balance
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            disabled={
              !selectedPackage || buyPackage.isPending || billingQuery.isLoading
            }
            onClick={() => {
              if (!selectedPackage) {
                return
              }

              buyPackage.mutate(selectedPackage.id, {
                onSuccess: () => {
                  onClose()
                  toast.success("Messages package purchased")
                },
                onError: (error) => toast.error(getMessageErrorMessage(error)),
              })
            }}
          >
            {buyPackage.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CreditCard />
            )}
            Purchase
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function PushTestCard({ app }: { app: DTOMessagesApp }) {
  const formId = useId()
  const tokenQuery = useMessagesTokenQuery(app.verify ? app.id : null)
  const sendPush = useSendMessagesPushMutation(app.verify ? app.id : null)
  const [confirmBroadcastOpen, setConfirmBroadcastOpen] = useState(false)
  const [values, setValues] = useState<MessagePushFormValues>(
    getMessagePushFormDefaultValues()
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof MessagePushFormValues, string>>
  >({})

  const submit = () => {
    const nextErrors = validateMessagePushForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (getMessagePushAddresses(values.addresses).length === 0) {
      setConfirmBroadcastOpen(true)
      return
    }

    send()
  }

  const send = () => {
    sendPush.mutate(valuesToMessagePushPayload(values), {
      onSuccess: () => {
        setConfirmBroadcastOpen(false)
        setValues(getMessagePushFormDefaultValues())
        toast.success("Push message sent")
      },
      onError: (error) => toast.error(getMessageErrorMessage(error)),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push test</CardTitle>
        <CardDescription>
          Send a test push through the Messages API with this app token.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!app.verify ? (
          <Alert>
            <AlertCircle />
            <AlertTitle>Verification required</AlertTitle>
            <AlertDescription>
              Verify the Messages app before sending push notifications.
            </AlertDescription>
          </Alert>
        ) : null}
        <MessagePushForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={sendPush.isPending || tokenQuery.isLoading || !app.verify}
          onChange={setValues}
          onSubmit={submit}
        />
        {sendPush.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Push could not be sent</AlertTitle>
            <AlertDescription>
              {getMessageErrorMessage(sendPush.error)}
            </AlertDescription>
          </Alert>
        ) : null}
        <div>
          <Button
            form={formId}
            type="submit"
            disabled={sendPush.isPending || tokenQuery.isLoading || !app.verify}
          >
            {sendPush.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send />
            )}
            Send test push
          </Button>
        </div>
      </CardContent>
      <AlertDialog
        open={confirmBroadcastOpen}
        onOpenChange={setConfirmBroadcastOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Send />
            </AlertDialogMedia>
            <AlertDialogTitle>Send to all users?</AlertDialogTitle>
            <AlertDialogDescription>
              Recipients are empty, so this push will be sent to all app users
              with notifications enabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sendPush.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button disabled={sendPush.isPending} onClick={send}>
              {sendPush.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
              Send to all
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function CopyBlock({
  title = "Value",
  value,
}: {
  title?: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            copyToClipboard(value)
            toast.success("Copied")
          }}
        >
          <Copy />
          Copy
        </Button>
      </div>
      <pre className="max-h-52 overflow-auto p-3 text-xs break-all whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  )
}

function MessagesLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <Separator />
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function getPaymentDeficitUsd(
  packagePrice: number | null | undefined,
  balance: number | null | undefined
) {
  if (packagePrice === undefined || packagePrice === null) {
    return 0
  }

  if (balance === undefined || balance === null) {
    return 0
  }

  return Math.max(packagePrice - balance, 0)
}

function formatTimestamp(value: number) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "unknown date"
    : date.toLocaleDateString()
}

function formatUnixDate(value: number) {
  return new Date(value * 1000).toLocaleString()
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
