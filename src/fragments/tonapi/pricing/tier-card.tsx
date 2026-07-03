import type { ReactNode } from "react"
import { CheckCircle2, Loader2, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { formatUsd } from "@/utils/tonapi/pricing/pricing-utils"

type TierCardProps = {
  name: string
  priceUsd: number
  priceLabel: string
  rps: number | string
  priceText?: string
  billingLabel?: string
  current?: boolean
  disabled?: boolean
  pending?: boolean
  details?: string[]
  actionLabel?: string
  actionWrapper?: (action: ReactNode) => ReactNode
  onSelect?: () => void
}

export function TierCard({
  name,
  priceUsd,
  priceLabel,
  rps,
  priceText,
  billingLabel,
  current,
  disabled,
  pending,
  details = [],
  actionLabel = "Choose tier",
  actionWrapper,
  onSelect,
}: TierCardProps) {
  const action = (
    <Button
      size="sm"
      className="w-full"
      variant={current ? "secondary" : "default"}
      disabled={current || disabled || pending}
      onClick={onSelect}
    >
      {pending ? <Loader2 className="animate-spin" /> : null}
      {current ? "Current tier" : actionLabel}
    </Button>
  )

  return (
    <Card
      size="sm"
      className={cn(
        "flex h-full flex-col",
        current ? "border-primary shadow-sm" : null
      )}
    >
      <CardHeader className="px-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm">{name}</CardTitle>
            <CardDescription className="text-xs">
              {billingLabel ?? priceLabel}
            </CardDescription>
          </div>
          {current ? (
            <Badge className="h-6 shrink-0 text-xs">
              <CheckCircle2 />
              Current
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid flex-1 gap-3 px-3">
        <div>
          <div className="text-2xl font-semibold tracking-normal">
            {priceText ?? formatUsd(priceUsd)}
          </div>
          <div className="text-xs text-muted-foreground">{priceLabel}</div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Zap className="size-3.5 text-muted-foreground" />
          <span className="font-medium">{rps}</span>
          <span className="text-muted-foreground">RPS</span>
        </div>
        {details.length > 0 ? (
          <ul className="grid gap-1.5 text-xs text-muted-foreground">
            {details.map((detail) => (
              <li key={detail} className="flex gap-1.5">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
      <CardFooter className="p-3">
        {actionWrapper ? actionWrapper(action) : action}
      </CardFooter>
    </Card>
  )
}
