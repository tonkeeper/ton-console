import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { Copy, LogOut, MessageSquare, UserRound } from "lucide-react"
import copyToClipboard from "copy-to-clipboard"

import type { DTOUser } from "@/api/api.generated"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FeedbackDialog } from "@/fragments/feedback/feedback-dialog"
import { useLogoutMutation, useSessionQuery } from "@/hooks/use-auth"
import { useSelectedProject } from "@/hooks/use-project"

export function ProfilePage() {
  const navigate = useNavigate()
  const session = useSessionQuery()
  const logout = useLogoutMutation()
  const { selectedProject } = useSelectedProject()
  const user = session.data ?? null
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const referralUrl = useMemo(() => getReferralUrl(user), [user])

  if (session.isLoading) {
    return (
      <div className="grid w-full gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <Empty className="min-h-[calc(100svh-8rem)] border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserRound />
          </EmptyMedia>
          <EmptyTitle>No active session</EmptyTitle>
          <EmptyDescription>Sign in to view your profile.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid w-full gap-4">
      <PageHeader
        title="Profile"
        description="Current TON Console account."
        actions={
          <>
            <FeedbackDialog
              project={selectedProject}
              source="profile"
              trigger={
                <Button type="button" variant="outline">
                  <MessageSquare className="size-4" />
                  Feedback
                </Button>
              }
            />
            <Button
              type="button"
              variant="outline"
              disabled={logout.isPending}
              onClick={() =>
                logout.mutate(undefined, {
                  onSettled: () => navigate("/login", { replace: true }),
                })
              }
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Personal session details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-lg">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback className="rounded-lg">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-medium">{getUserName(user)}</div>
              <div className="text-sm text-muted-foreground">ID {user.id}</div>
            </div>
          </div>
          {user.wallet_address ? (
            <>
              <Separator />
              <div className="grid gap-1">
                <div className="text-sm font-medium">Wallet</div>
                <div className="text-sm break-all text-muted-foreground">
                  {user.wallet_address}
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral</CardTitle>
          <CardDescription>
            {user.referrals_count} invited users
          </CardDescription>
          {referralUrl ? (
            <CardAction>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  await copyToClipboard(referralUrl)
                  setCopyStatus("Copied")
                }}
              >
                <Copy className="size-4" />
                Copy
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent>
          {referralUrl ? (
            <div className="grid gap-2">
              <div className="rounded-md border bg-muted/40 p-3 text-sm break-all">
                {referralUrl}
              </div>
              {copyStatus ? (
                <div className="text-sm text-muted-foreground">
                  {copyStatus}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Referral details are not available for this account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getReferralUrl(user: DTOUser | null) {
  if (!user?.referral_id || typeof window === "undefined") {
    return null
  }

  const url = new URL(window.location.origin)
  url.searchParams.set("referral", user.referral_id)

  return url.toString()
}

function getUserName(user: DTOUser) {
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.wallet_address ||
    `User #${user.id}`
  )
}

function getUserInitials(user: DTOUser) {
  const name = getUserName(user)

  if (name.startsWith("0:")) {
    return "TC"
  }

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
