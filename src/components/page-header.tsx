import type { ReactNode } from "react"

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="grid gap-1">
        <h2 className="font-heading text-2xl font-semibold tracking-normal">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {actions}
        </div>
      ) : null}
    </section>
  )
}
