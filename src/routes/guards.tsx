import { Navigate, Outlet, useLocation } from "react-router"

import TonConsoleLogo from "@/assets/ton-console-logo.svg"
import { useSessionQuery } from "@/hooks/use-auth"
import { useSelectedProject } from "@/hooks/use-project"

export function RequireSession() {
  const session = useSessionQuery()
  const location = useLocation()

  if (session.isLoading) {
    return <AppLoadingScreen />
  }

  if (!session.data) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function RequireProject() {
  const location = useLocation()
  const projects = useSelectedProject()

  if (projects.isLoading) {
    return <AppLoadingScreen />
  }

  if (!projects.projects.length) {
    return (
      <Navigate
        to="/create-first-project"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export function AppLoadingScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="grid justify-items-center gap-3">
        <span className="flex size-14 items-center justify-center" aria-hidden="true">
          <TonConsoleLogo />
        </span>
        <span className="text-sm font-semibold tracking-normal text-foreground">
          TON Console
        </span>
      </div>
    </main>
  )
}
