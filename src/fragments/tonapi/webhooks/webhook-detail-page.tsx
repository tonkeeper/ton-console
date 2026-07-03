import { useEffect, useId, useMemo, useRef, useState } from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
  Webhook,
} from "lucide-react"
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"

import {
  RTWebhookListStatusEnum,
  RTWebhookMsgOpcodeSubscriptionsStatusEnum,
} from "@/api/webhooks.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageHeader } from "@/components/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  EmptyContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  DeleteWebhookDialog,
  RegenerateTokenDialog,
  WebhookSuspendedDialog,
} from "./webhook-dialogs"
import {
  useAddAccountSubscriptionsMutation,
  useAddOpcodeSubscriptionMutation,
  useBackOnlineMutation,
  useRemoveAccountSubscriptionMutation,
  useRemoveOpcodeSubscriptionMutation,
  useToggleMempoolSubscriptionMutation,
  useToggleNewContractsSubscriptionMutation,
  useWebhookAccountSubscriptionsQuery,
  useWebhookFailureLogsQuery,
  useWebhookOpcodeSubscriptionsQuery,
  useWebhooksQuery,
} from "@/utils/tonapi/webhooks/webhook-queries"
import type {
  AccountSubscription,
  FailureLog,
  OpcodeSubscription,
  Webhook as WebhookType,
  WebhookNetwork,
} from "@/utils/tonapi/webhooks/webhook-types"
import {
  WEBHOOKS_DOCUMENTATION_URL,
  formatDateTime,
  formatWebhookAccountAddress,
  getApiErrorMessage,
  getStoredWebhookNetwork,
  getWebhookStatusBadgeClassName,
  getWebhookStatusBadgeVariant,
  getWebhookStatusLabel,
  isWebhookNetwork,
  parseAccountList,
  storeWebhookNetwork,
  validateAccountList,
  validateOpcode,
} from "@/utils/tonapi/webhooks/webhook-utils"

const ACCOUNT_SUBSCRIPTIONS_PAGE_SIZE = 20

export function TonApiWebhookDetailPage() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const webhookId = parseWebhookId(params.webhookId)
  const network = getNetwork(searchParams.get("network"))
  const projectQuery = useSelectedProject()
  const initialProjectIdRef = useRef(projectQuery.selectedProjectId)
  const webhooksQuery = useWebhooksQuery(network)
  const webhook = useMemo(
    () => webhooksQuery.data?.find((item) => item.id === webhookId),
    [webhookId, webhooksQuery.data]
  )

  useEffect(() => {
    storeWebhookNetwork(network)
  }, [network])

  useEffect(() => {
    if (!initialProjectIdRef.current && projectQuery.selectedProjectId) {
      initialProjectIdRef.current = projectQuery.selectedProjectId
      return
    }

    if (
      initialProjectIdRef.current &&
      projectQuery.selectedProjectId &&
      initialProjectIdRef.current !== projectQuery.selectedProjectId
    ) {
      navigate(getWebhooksListPath(network), { replace: true })
    }
  }, [navigate, network, projectQuery.selectedProjectId])

  if (!webhookId) {
    return <Navigate to="/tonapi/webhooks" replace />
  }

  const backHref = getWebhooksListPath(network)

  return (
    <div className="grid gap-4">
      {webhooksQuery.isLoading ? (
        <LoadingState label="Loading webhook" />
      ) : null}

      {webhooksQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error loading webhook</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(webhooksQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {webhooksQuery.isSuccess && !webhook ? (
        <Card>
          <CardContent className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Webhook />
                </EmptyMedia>
                <EmptyTitle>Webhook not found</EmptyTitle>
                <EmptyDescription>
                  It may belong to another project, network, or it may have been
                  deleted.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link to={backHref}>Back to webhooks</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : null}

      {webhook ? (
        <>
          <WebhookDetailHeader
            webhook={webhook}
            network={network}
            onDelete={() => setDeleteOpen(true)}
          />
          <WebhookOverviewCard webhook={webhook} network={network} />
          <WebhookSubscriptionsCard webhook={webhook} network={network} />
          <DeleteWebhookDialog
            network={network}
            webhook={webhook}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      ) : null}
    </div>
  )
}

function WebhookDetailHeader({
  webhook,
  network,
  onDelete,
}: {
  webhook: WebhookType
  network: WebhookNetwork
  onDelete: () => void
}) {
  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const [suspendedOpen, setSuspendedOpen] = useState(false)
  const backOnline = useBackOnlineMutation(network)
  const isOffline = webhook.status === RTWebhookListStatusEnum.RTOffline
  const isSuspended = webhook.status === RTWebhookListStatusEnum.RTSuspended

  return (
    <>
      <PageHeader
        title={
          <span className="block min-w-0 break-all">{webhook.endpoint}</span>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>Webhook #{webhook.id}</span>
            <Badge
              variant={getWebhookStatusBadgeVariant(webhook.status)}
              className={getWebhookStatusBadgeClassName(webhook.status)}
            >
              {getWebhookStatusLabel(webhook.status)}
            </Badge>
            <Badge variant="secondary">{network}</Badge>
          </span>
        }
        actions={
          <>
            {isOffline || isSuspended ? (
              <Button
                variant="outline"
                disabled={backOnline.isPending}
                onClick={() => backOnline.mutate(webhook.id)}
              >
                {backOnline.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Power />
                )}
                Try online
              </Button>
            ) : null}
            {isSuspended ? (
              <Button variant="outline" onClick={() => setSuspendedOpen(true)}>
                Top up balance
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => setRegenerateOpen(true)}>
              <RefreshCw />
              Regenerate token
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 />
              Delete
            </Button>
          </>
        }
      />

      {isSuspended ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Webhook suspended</AlertTitle>
          <AlertDescription>
            This webhook was suspended due to insufficient balance. Top up the
            project balance, then use Try online to restore delivery.
          </AlertDescription>
        </Alert>
      ) : null}
      {backOnline.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to mark webhook online</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(backOnline.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      <RegenerateTokenDialog
        network={network}
        webhook={webhook}
        open={regenerateOpen}
        onOpenChange={setRegenerateOpen}
      />
      <WebhookSuspendedDialog
        open={suspendedOpen}
        onOpenChange={setSuspendedOpen}
      />
    </>
  )
}

function WebhookOverviewCard({
  webhook,
  network,
}: {
  webhook: WebhookType
  network: WebhookNetwork
}) {
  const [copiedToken, setCopiedToken] = useState(false)
  const toggleMempool = useToggleMempoolSubscriptionMutation(
    webhook.id,
    network
  )
  const toggleNewContracts = useToggleNewContractsSubscriptionMutation(
    webhook.id,
    network
  )
  const pending = toggleMempool.isPending || toggleNewContracts.isPending

  useEffect(() => {
    if (!copiedToken) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedToken(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedToken])

  return (
    <Card>
      <CardContent className="grid gap-4">
        {toggleMempool.isError || toggleNewContracts.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to update subscription</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(
                toggleMempool.error ?? toggleNewContracts.error
              )}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Accounts" value={String(webhook.subscribed_accounts)} />
          <Stat
            label="Opcodes"
            value={String(webhook.subscribed_msg_opcodes)}
          />
          <Stat
            label="Failed attempts"
            value={String(webhook.status_failed_attempts)}
          />
          <Stat
            label="Last online"
            value={formatDateTime(webhook.last_online_at)}
          />
          <Stat
            label="Status updated"
            value={formatDateTime(webhook.status_updated_at)}
          />
        </div>

        <div className="grid gap-2 rounded-lg border p-4">
          <div className="text-sm font-medium">Token</div>
          <div className="flex min-w-0 items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1.5 text-xs">
              {webhook.token}
            </code>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Copy webhook token"
              onClick={() => {
                copyToClipboard(webhook.token)
                setCopiedToken(true)
              }}
            >
              {copiedToken ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ToggleRow
            title="Mempool messages"
            description="Receive notifications for mempool messages."
            checked={webhook.subscribed_to_mempool}
            disabled={pending}
            onCheckedChange={(checked) => toggleMempool.mutate(checked)}
          />
          <ToggleRow
            title="New contracts"
            description="Receive notifications when new contracts are deployed."
            checked={webhook.subscribed_to_new_contracts}
            disabled={pending}
            onCheckedChange={(checked) => toggleNewContracts.mutate(checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function WebhookSubscriptionsCard({
  webhook,
  network,
}: {
  webhook: WebhookType
  network: WebhookNetwork
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>
          Manage account transaction, opcode, mempool, and failed delivery
          state. More options are available in the{" "}
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={WEBHOOKS_DOCUMENTATION_URL}
            target="_blank"
            rel="noreferrer"
          >
            Webhooks API documentation
            <ExternalLink className="size-3" />
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accounts">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="opcodes">Opcodes</TabsTrigger>
            <TabsTrigger value="logs">Failed logs</TabsTrigger>
          </TabsList>
          <TabsContent value="accounts" className="mt-4">
            <AccountSubscriptions webhookId={webhook.id} network={network} />
          </TabsContent>
          <TabsContent value="opcodes" className="mt-4">
            <OpcodeSubscriptions webhookId={webhook.id} network={network} />
          </TabsContent>
          <TabsContent value="logs" className="mt-4">
            <FailureLogs webhookId={webhook.id} network={network} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AccountSubscriptions({
  webhookId,
  network,
}: {
  webhookId: number
  network: WebhookNetwork
}) {
  const [addOpen, setAddOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [accountFilter, setAccountFilter] = useState("")
  const [removeCandidate, setRemoveCandidate] =
    useState<AccountSubscription | null>(null)
  const offset = (page - 1) * ACCOUNT_SUBSCRIPTIONS_PAGE_SIZE
  const subscriptionsQuery = useWebhookAccountSubscriptionsQuery(
    webhookId,
    network,
    offset,
    ACCOUNT_SUBSCRIPTIONS_PAGE_SIZE
  )
  const removeAccount = useRemoveAccountSubscriptionMutation(webhookId, network)
  const subscriptions = subscriptionsQuery.data ?? []
  const filteredSubscriptions = useMemo(() => {
    const normalizedFilter = accountFilter.trim().toLowerCase()

    if (!normalizedFilter) {
      return subscriptions
    }

    return subscriptions.filter((subscription) =>
      subscription.account_id.toLowerCase().includes(normalizedFilter)
    )
  }, [accountFilter, subscriptions])
  const hasNextPage = subscriptions.length === ACCOUNT_SUBSCRIPTIONS_PAGE_SIZE

  useEffect(() => {
    setPage(1)
    setAccountFilter("")
  }, [network, webhookId])

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={accountFilter}
            className="pl-9"
            placeholder="Filter accounts on this page"
            onChange={(event) => setAccountFilter(event.target.value)}
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus />
          Add accounts
        </Button>
      </div>

      {subscriptionsQuery.isLoading ? (
        <LoadingState label="Loading account subscriptions" />
      ) : null}

      {subscriptionsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error loading account subscriptions</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(subscriptionsQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {removeAccount.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to remove account</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(removeAccount.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {subscriptionsQuery.isSuccess &&
      subscriptions.length === 0 &&
      page === 1 ? (
        <Empty className="min-h-56">
          <EmptyHeader>
            <EmptyTitle>No account subscriptions</EmptyTitle>
            <EmptyDescription>
              Add account addresses to receive transaction events.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setAddOpen(true)}>
              <Plus />
              Add accounts
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {subscriptionsQuery.isSuccess &&
      subscriptions.length > 0 &&
      filteredSubscriptions.length === 0 ? (
        <Empty className="min-h-40">
          <EmptyHeader>
            <EmptyTitle>No matching accounts</EmptyTitle>
            <EmptyDescription>
              Clear the filter to see this page of subscriptions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => setAccountFilter("")}>
              Clear filter
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {filteredSubscriptions.length > 0 ? (
        <>
          <AccountsTable
            subscriptions={filteredSubscriptions}
            network={network}
            removingAccount={removeAccount.variables}
            isRemoving={removeAccount.isPending}
            onRemove={setRemoveCandidate}
          />
          <AccountSubscriptionsPagination
            page={page}
            pageSize={ACCOUNT_SUBSCRIPTIONS_PAGE_SIZE}
            visibleCount={subscriptions.length}
            hasNextPage={hasNextPage}
            disabled={subscriptionsQuery.isFetching}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <AddAccountsDialog
        webhookId={webhookId}
        network={network}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
      <DeleteAccountSubscriptionDialog
        subscription={removeCandidate}
        pending={removeAccount.isPending}
        open={Boolean(removeCandidate)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveCandidate(null)
          }
        }}
        onConfirm={(accountId) =>
          removeAccount.mutate(accountId, {
            onSuccess: () => setRemoveCandidate(null),
          })
        }
      />
    </div>
  )
}

function AccountSubscriptionsPagination({
  page,
  pageSize,
  visibleCount,
  hasNextPage,
  disabled,
  onPageChange,
}: {
  page: number
  pageSize: number
  visibleCount: number
  hasNextPage: boolean
  disabled: boolean
  onPageChange: (page: number) => void
}) {
  if (page === 1 && !hasNextPage) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {(page - 1) * pageSize + 1}-
        {(page - 1) * pageSize + visibleCount}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          {disabled ? <Loader2 className="animate-spin" /> : null}
          Next
        </Button>
      </div>
    </div>
  )
}

function AccountsTable({
  subscriptions,
  network,
  removingAccount,
  isRemoving,
  onRemove,
}: {
  subscriptions: AccountSubscription[]
  network: WebhookNetwork
  removingAccount?: string
  isRemoving: boolean
  onRemove: (subscription: AccountSubscription) => void
}) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedAccount) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopiedAccount(null), 1500)
    return () => window.clearTimeout(timeout)
  }, [copiedAccount])

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Last delivered LT</TableHead>
            <TableHead>Failed attempts</TableHead>
            <TableHead>Failed LT</TableHead>
            <TableHead>Failed at</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => {
            const formattedAccount = formatWebhookAccountAddress(
              subscription.account_id,
              network
            )

            return (
              <TableRow key={subscription.account_id}>
                <TableCell className="max-w-[320px]">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="min-w-0 truncate font-mono text-xs">
                      {formattedAccount}
                    </span>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Copy account address"
                      onClick={() => {
                        copyToClipboard(formattedAccount)
                        setCopiedAccount(formattedAccount)
                      }}
                    >
                      {copiedAccount === formattedAccount ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{subscription.last_delivered_lt ?? "-"}</TableCell>
                <TableCell>{subscription.failed_attempts ?? "-"}</TableCell>
                <TableCell>{subscription.failed_lt ?? "-"}</TableCell>
                <TableCell>{formatDateTime(subscription.failed_at)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Remove account subscription"
                    disabled={
                      isRemoving && removingAccount === subscription.account_id
                    }
                    onClick={() => onRemove(subscription)}
                  >
                    {isRemoving &&
                    removingAccount === subscription.account_id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function DeleteAccountSubscriptionDialog({
  subscription,
  pending,
  open,
  onOpenChange,
  onConfirm,
}: {
  subscription: AccountSubscription | null
  pending: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (accountId: string) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove account subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            This account will stop sending transaction events to the webhook.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {subscription ? (
          <div className="rounded-lg border bg-muted p-3">
            <code className="block text-xs break-all">
              {subscription.account_id}
            </code>
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending || !subscription}
            onClick={(event) => {
              event.preventDefault()
              if (subscription) {
                onConfirm(subscription.account_id)
              }
            }}
          >
            {pending ? <Loader2 className="animate-spin" /> : null}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AddAccountsDialog({
  webhookId,
  network,
  open,
  onOpenChange,
}: {
  webhookId: number
  network: WebhookNetwork
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const formId = useId()
  const addAccounts = useAddAccountSubscriptionsMutation(webhookId, network)
  const [accounts, setAccounts] = useState("")
  const [error, setError] = useState<string | null>(null)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setAccounts("")
      setError(null)
      addAccounts.reset()
    }
    wasOpenRef.current = open
  }, [addAccounts, open])

  const submit = () => {
    const nextError = validateAccountList(accounts, network)
    setError(nextError)
    if (nextError) {
      return
    }

    addAccounts.mutate(parseAccountList(accounts, network), {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add account subscriptions</DialogTitle>
          <DialogDescription>
            Add one or more account addresses for transaction notifications.
          </DialogDescription>
        </DialogHeader>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <Field className="min-w-0" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`${formId}-accounts`}>Accounts</FieldLabel>
            <Textarea
              id={`${formId}-accounts`}
              className="min-w-0 max-w-full break-all [field-sizing:fixed] placeholder:whitespace-pre-line"
              value={accounts}
              placeholder={"EQ...\nUQ..."}
              disabled={addAccounts.isPending}
              onChange={(event) => {
                setAccounts(event.target.value)
                setError(null)
              }}
            />
            <FieldDescription>
              Separate addresses with commas or new lines.
            </FieldDescription>
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
        </form>
        {addAccounts.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(addAccounts.error, "Accounts were not added.")}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={addAccounts.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={addAccounts.isPending}>
            {addAccounts.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OpcodeSubscriptions({
  webhookId,
  network,
}: {
  webhookId: number
  network: WebhookNetwork
}) {
  const [opcode, setOpcode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [opcodeFilter, setOpcodeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | RTWebhookMsgOpcodeSubscriptionsStatusEnum
  >("all")
  const [removeCandidate, setRemoveCandidate] =
    useState<OpcodeSubscription | null>(null)
  const opcodesQuery = useWebhookOpcodeSubscriptionsQuery(webhookId, network)
  const addOpcode = useAddOpcodeSubscriptionMutation(webhookId, network)
  const removeOpcode = useRemoveOpcodeSubscriptionMutation(webhookId, network)
  const opcodes = opcodesQuery.data ?? []
  const filteredOpcodes = useMemo(() => {
    const normalizedFilter = opcodeFilter.trim().toLowerCase()

    return opcodes.filter((subscription) => {
      const matchesStatus =
        statusFilter === "all" || subscription.status === statusFilter
      const matchesFilter =
        !normalizedFilter ||
        subscription.opcode.toLowerCase().includes(normalizedFilter)

      return matchesStatus && matchesFilter
    })
  }, [opcodeFilter, opcodes, statusFilter])

  const submit = () => {
    const nextError = validateOpcode(opcode)
    setError(nextError)
    if (nextError) {
      return
    }

    addOpcode.mutate(opcode.trim(), {
      onSuccess: () => setOpcode(""),
    })
  }

  return (
    <div className="grid gap-4">
      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,24rem)_auto] sm:items-end sm:justify-start"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Field className="sm:max-w-sm" data-invalid={Boolean(error)}>
          <FieldLabel htmlFor="webhook-opcode">Opcode</FieldLabel>
          <Input
            id="webhook-opcode"
            value={opcode}
            placeholder="0x7362d09c"
            disabled={addOpcode.isPending}
            onChange={(event) => {
              setOpcode(event.target.value)
              setError(null)
            }}
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button disabled={addOpcode.isPending}>
          {addOpcode.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus />
          )}
          Add opcode
        </Button>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={opcodeFilter}
            className="pl-9"
            placeholder="Filter opcodes"
            onChange={(event) => setOpcodeFilter(event.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (value === "all" || isOpcodeStatus(value)) {
              setStatusFilter(value)
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter opcodes">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem
              value={RTWebhookMsgOpcodeSubscriptionsStatusEnum.RTActive}
            >
              Active
            </SelectItem>
            <SelectItem
              value={RTWebhookMsgOpcodeSubscriptionsStatusEnum.RTDisabled}
            >
              Disabled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {opcodesQuery.isLoading ? <LoadingState label="Loading opcodes" /> : null}

      {opcodesQuery.isError || addOpcode.isError || removeOpcode.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Opcode subscription error</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(
              opcodesQuery.error ?? addOpcode.error ?? removeOpcode.error
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      {opcodesQuery.isSuccess && opcodes.length === 0 ? (
        <Empty className="min-h-48">
          <EmptyHeader>
            <EmptyTitle>No opcode subscriptions</EmptyTitle>
            <EmptyDescription>
              Add message opcodes to receive matching event notifications.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {opcodesQuery.isSuccess &&
      opcodes.length > 0 &&
      filteredOpcodes.length === 0 ? (
        <Empty className="min-h-40">
          <EmptyHeader>
            <EmptyTitle>No matching opcodes</EmptyTitle>
            <EmptyDescription>
              Clear the filters to see subscribed opcodes.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={() => {
                setOpcodeFilter("")
                setStatusFilter("all")
              }}
            >
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {filteredOpcodes.length > 0 ? (
        <OpcodesTable
          subscriptions={filteredOpcodes}
          removingOpcode={removeOpcode.variables}
          isRemoving={removeOpcode.isPending}
          onRemove={setRemoveCandidate}
        />
      ) : null}
      <DeleteOpcodeSubscriptionDialog
        subscription={removeCandidate}
        pending={removeOpcode.isPending}
        open={Boolean(removeCandidate)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveCandidate(null)
          }
        }}
        onConfirm={(nextOpcode) =>
          removeOpcode.mutate(nextOpcode, {
            onSuccess: () => setRemoveCandidate(null),
          })
        }
      />
    </div>
  )
}

function OpcodesTable({
  subscriptions,
  removingOpcode,
  isRemoving,
  onRemove,
}: {
  subscriptions: OpcodeSubscription[]
  removingOpcode?: string
  isRemoving: boolean
  onRemove: (subscription: OpcodeSubscription) => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Opcode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Disabled at</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.opcode}>
              <TableCell className="font-mono text-xs">
                {subscription.opcode}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    subscription.status ===
                    RTWebhookMsgOpcodeSubscriptionsStatusEnum.RTActive
                      ? "default"
                      : "secondary"
                  }
                >
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDateTime(subscription.disabled_at)}</TableCell>
              <TableCell className="text-muted-foreground">
                {subscription.disabled_reason ?? "-"}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Remove opcode subscription"
                  disabled={
                    isRemoving && removingOpcode === subscription.opcode
                  }
                  onClick={() => onRemove(subscription)}
                >
                  {isRemoving && removingOpcode === subscription.opcode ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DeleteOpcodeSubscriptionDialog({
  subscription,
  pending,
  open,
  onOpenChange,
  onConfirm,
}: {
  subscription: OpcodeSubscription | null
  pending: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (opcode: string) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove opcode subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            Matching message opcode events will no longer be delivered to this
            webhook.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {subscription ? (
          <div className="rounded-lg border bg-muted p-3">
            <code className="block text-xs break-all">
              {subscription.opcode}
            </code>
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending || !subscription}
            onClick={(event) => {
              event.preventDefault()
              if (subscription) {
                onConfirm(subscription.opcode)
              }
            }}
          >
            {pending ? <Loader2 className="animate-spin" /> : null}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function FailureLogs({
  webhookId,
  network,
}: {
  webhookId: number
  network: WebhookNetwork
}) {
  const [offsets, setOffsets] = useState([0])
  const offset = offsets[offsets.length - 1] ?? 0
  const logsQuery = useWebhookFailureLogsQuery(webhookId, network, offset)
  const logs = logsQuery.data?.logs ?? []
  const nextOffset = logsQuery.data?.next_offset
  const pagination = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={logsQuery.isFetching || offsets.length === 1}
        onClick={() => setOffsets((current) => current.slice(0, -1))}
      >
        Previous
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={logsQuery.isFetching || nextOffset === undefined}
        onClick={() => {
          if (nextOffset !== undefined) {
            setOffsets((current) => [...current, nextOffset])
          }
        }}
      >
        {logsQuery.isFetching && logs.length > 0 ? (
          <Loader2 className="animate-spin" />
        ) : null}
        Next
      </Button>
    </div>
  )

  useEffect(() => {
    setOffsets([0])
  }, [network, webhookId])

  return (
    <div className="grid gap-4">
      {logsQuery.isLoading ? (
        <LoadingState label="Loading failed logs" />
      ) : null}

      {logsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error loading failed logs</AlertTitle>
          <AlertDescription>
            {getApiErrorMessage(logsQuery.error)}
          </AlertDescription>
        </Alert>
      ) : null}

      {logsQuery.isSuccess && logs.length === 0 ? (
        <Empty className="min-h-48">
          <EmptyHeader>
            <EmptyTitle>No failed delivery logs</EmptyTitle>
            <EmptyDescription>
              Delivery failures for this webhook will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {logs.length > 0 ? <LogsTable logs={logs} /> : null}

      {pagination}
    </div>
  )
}

function LogsTable({ logs }: { logs: FailureLog[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="[&_tr:hover]:!bg-transparent">
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={`${log.timestamp}-${index}`}>
              <TableCell className="text-muted-foreground">
                {formatDateTime(log.timestamp)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{log.event_type}</Badge>
              </TableCell>
              <TableCell className="max-w-[420px] truncate">
                {log.message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="truncate text-lg font-semibold">{value}</div>
    </div>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-muted-foreground">
      <Loader2 className="mr-2 animate-spin" />
      {label}
    </div>
  )
}

function parseWebhookId(value: string | undefined) {
  const parsed = value ? Number(value) : NaN
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function getNetwork(value: string | null): WebhookNetwork {
  if (isWebhookNetwork(value)) {
    return value
  }

  return getStoredWebhookNetwork()
}

function getWebhooksListPath(network: WebhookNetwork) {
  return network === "testnet"
    ? "/tonapi/webhooks?network=testnet"
    : "/tonapi/webhooks"
}

function isOpcodeStatus(
  value: string
): value is RTWebhookMsgOpcodeSubscriptionsStatusEnum {
  return (
    value === RTWebhookMsgOpcodeSubscriptionsStatusEnum.RTActive ||
    value === RTWebhookMsgOpcodeSubscriptionsStatusEnum.RTDisabled
  )
}
