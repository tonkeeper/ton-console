import type { ReactNode } from "react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <Empty
      className={cn(
        "min-h-72 rounded-xl border border-solid bg-muted/30",
        className
      )}
    >
      <EmptyHeader className="max-w-md gap-3">
        {icon ? (
          <EmptyMedia
            variant="icon"
            className="mb-0 size-11 rounded-xl bg-background text-muted-foreground [&_svg:not([class*='size-'])]:size-5"
          >
            {icon}
          </EmptyMedia>
        ) : null}
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        {description ? (
          <EmptyDescription className="max-w-md text-sm">
            {description}
          </EmptyDescription>
        ) : null}
      </EmptyHeader>
      {actions ? (
        <EmptyContent className="max-w-none flex-row flex-wrap justify-center">
          {actions}
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
