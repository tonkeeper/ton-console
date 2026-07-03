import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  useTelegramAuthAvailability,
  useTelegramLoginMutation,
} from "@/hooks/use-telegram-auth"

export function PublicAuthPanel() {
  const telegramAvailability = useTelegramAuthAvailability()
  const telegramLogin = useTelegramLoginMutation()

  return (
    <Button
      type="button"
      disabled={!telegramAvailability.isConfigured || telegramLogin.isPending}
      onClick={() => telegramLogin.mutate()}
      size="lg"
    >
      {telegramLogin.isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Send className="size-4" />
      )}
      Continue with Telegram
    </Button>
  )
}
