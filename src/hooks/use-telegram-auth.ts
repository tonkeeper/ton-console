import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/api/client"
import type { DTOTgAuth } from "@/api/api.generated"
import { authQueryKeys } from "@/lib/auth"
import { fetchCurrentUser } from "@/hooks/use-auth"

type TelegramLoginOptions = {
  bot_id: string
  request_access?: "write"
  lang?: string
}

type TelegramLoginData = Omit<DTOTgAuth, "referral_id"> & {
  username?: string
  photo_url?: string
}

type TelegramLoginCallback = (data: TelegramLoginData | false) => void

declare global {
  interface Window {
    Telegram?: {
      Login?: {
        auth?: (
          options: TelegramLoginOptions,
          callback: TelegramLoginCallback
        ) => void
      }
    }
  }
}

const telegramWidgetScriptId = "telegram-login-widget-script"

function getTelegramBotId() {
  const value = import.meta.env.VITE_TG_OAUTH_BOT_ID

  return typeof value === "string" ? value.trim() : ""
}

function getReferralId() {
  if (typeof window === "undefined") {
    return undefined
  }

  return (
    new URLSearchParams(window.location.search).get("referral") ?? undefined
  )
}

function hasTelegramLoginProvider() {
  return (
    typeof window !== "undefined" &&
    typeof window.Telegram?.Login?.auth === "function"
  )
}

function loadTelegramWidget() {
  if (typeof document === "undefined") {
    return Promise.resolve(false)
  }

  if (hasTelegramLoginProvider()) {
    return Promise.resolve(true)
  }

  const existingScript = document.getElementById(telegramWidgetScriptId)

  if (existingScript) {
    return new Promise<boolean>((resolve) => {
      existingScript.addEventListener(
        "load",
        () => resolve(hasTelegramLoginProvider()),
        {
          once: true,
        }
      )
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      })
    })
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script")
    script.id = telegramWidgetScriptId
    script.async = true
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.addEventListener("load", () => resolve(hasTelegramLoginProvider()), {
      once: true,
    })
    script.addEventListener("error", () => resolve(false), { once: true })
    document.head.appendChild(script)
  })
}

async function requestTelegramLogin(botId: string) {
  const isReady = await loadTelegramWidget()

  if (!botId) {
    throw new Error("Telegram bot is not configured")
  }

  if (!isReady || !window.Telegram?.Login?.auth) {
    throw new Error("Telegram auth provider is unavailable")
  }

  return new Promise<TelegramLoginData>((resolve, reject) => {
    window.Telegram?.Login?.auth?.(
      { bot_id: botId, request_access: "write" },
      (data) => {
        if (!data) {
          reject(new Error("Telegram sign in was cancelled"))
          return
        }

        resolve(data)
      }
    )
  })
}

export function useTelegramAuthAvailability() {
  const botId = useMemo(() => getTelegramBotId(), [])
  const [isProviderAvailable, setIsProviderAvailable] = useState(() =>
    hasTelegramLoginProvider()
  )

  useEffect(() => {
    if (!botId || isProviderAvailable) {
      return
    }

    let isMounted = true

    loadTelegramWidget().then((available) => {
      if (isMounted) {
        setIsProviderAvailable(available)
      }
    })

    return () => {
      isMounted = false
    }
  }, [botId, isProviderAvailable])

  return {
    botId,
    isConfigured: Boolean(botId),
    isProviderAvailable,
  }
}

export function useTelegramLoginMutation() {
  const queryClient = useQueryClient()
  const botId = useMemo(() => getTelegramBotId(), [])

  return useMutation({
    mutationFn: async () => {
      const tgAuth = await requestTelegramLogin(botId)

      await api.api.authViaTg(
        {
          ...tgAuth,
          referral_id: getReferralId(),
        },
        { format: "json" }
      )

      return fetchCurrentUser()
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.currentUser, user)
      queryClient.invalidateQueries({ queryKey: authQueryKeys.projects })
    },
  })
}
