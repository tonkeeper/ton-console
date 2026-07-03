import { useEffect } from "react"
import { BrowserRouter } from "react-router"
import {
  THEME,
  TonConnectUIProvider,
  useTonConnectUI,
} from "@tonconnect/ui-react"
import { QueryClientProvider } from "@tanstack/react-query"

import { ThemeProvider, useTheme } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TONCONNECT_MANIFEST_URL } from "@/lib/env"
import { revalidateSessionOnUnauthorized } from "@/lib/auth"
import { queryClient } from "@/lib/query-client"
import { AppRouter } from "@/routes/router"

function getTonConnectTheme(theme: string) {
  if (theme === "dark") {
    return THEME.DARK
  }

  if (theme === "light") {
    return THEME.LIGHT
  }

  return typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
    ? THEME.DARK
    : THEME.LIGHT
}

function TonConnectThemeSync({ theme }: { theme: THEME }) {
  const [, setTonConnectOptions] = useTonConnectUI()

  useEffect(() => {
    setTonConnectOptions({ uiPreferences: { theme } })
  }, [setTonConnectOptions, theme])

  return null
}

function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const tonConnectTheme = getTonConnectTheme(theme)

  return (
    <TonConnectUIProvider
      manifestUrl={TONCONNECT_MANIFEST_URL}
      walletsRequiredFeatures={{
        sendTransaction: {
          minMessages: 16,
        },
      }}
      uiPreferences={{
        theme: tonConnectTheme,
        borderRadius: "s",
      }}
    >
      <TonConnectThemeSync theme={tonConnectTheme} />
      {children}
    </TonConnectUIProvider>
  )
}

function QueryUnauthorizedBridge() {
  useEffect(() => {
    const unsubscribeQueryCache = queryClient
      .getQueryCache()
      .subscribe((event) => {
        if (event.type !== "updated") {
          return
        }

        const error = event.query.state.error

        if (error) {
          revalidateSessionOnUnauthorized(
            queryClient,
            error,
            event.query.queryKey
          )
        }
      })
    const unsubscribeMutationCache = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type !== "updated") {
          return
        }

        const error = event.mutation.state.error

        if (error) {
          revalidateSessionOnUnauthorized(queryClient, error)
        }
      })

    return () => {
      unsubscribeQueryCache()
      unsubscribeMutationCache()
    }
  }, [])

  return null
}

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <QueryUnauthorizedBridge />
          <TonConnectProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </TonConnectProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
