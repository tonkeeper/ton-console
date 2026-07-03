import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Link, Outlet, useLocation } from "react-router"

import {
  ConsoleSidebar,
  getConsoleBreadcrumbItems,
  type ConsoleBreadcrumbItem,
  type ConsoleSidebarProps,
} from "@/components/navigation/console-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type AuthenticatedLayoutProps = {
  children?: ReactNode
  sidebar?: ReactNode
  sidebarProps?: ConsoleSidebarProps
  title?: string
  actions?: ReactNode
  className?: string
  contentClassName?: string
}

type HeaderBreadcrumbOverrideContextValue = {
  setItems: (items: ConsoleBreadcrumbItem[] | null) => void
}

const HeaderBreadcrumbOverrideContext =
  createContext<HeaderBreadcrumbOverrideContextValue | null>(null)

export function useHeaderBreadcrumbOverride(
  items: ConsoleBreadcrumbItem[] | null
) {
  const context = useContext(HeaderBreadcrumbOverrideContext)

  useEffect(() => {
    if (!context) {
      return undefined
    }

    context.setItems(items)

    return () => context.setItems(null)
  }, [context, items])
}

export function AuthenticatedLayout({
  children,
  sidebar,
  sidebarProps,
  title = "Console",
  actions,
  className,
  contentClassName,
}: AuthenticatedLayoutProps) {
  const location = useLocation()
  const [breadcrumbOverride, setBreadcrumbOverride] =
    useState<ConsoleBreadcrumbItem[] | null>(null)
  const computedBreadcrumbItems = getConsoleBreadcrumbItems(
    location.pathname,
    location.search,
    sidebarProps?.groups,
    sidebarProps?.footerItem
  )
  const breadcrumbItems = breadcrumbOverride ?? computedBreadcrumbItems
  const breadcrumbOverrideContext = useMemo(
    () => ({ setItems: setBreadcrumbOverride }),
    []
  )

  return (
    <HeaderBreadcrumbOverrideContext.Provider
      value={breadcrumbOverrideContext}
    >
      <SidebarProvider>
        {sidebar ?? <ConsoleSidebar {...sidebarProps} />}
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="h-4 self-center data-vertical:self-center"
            />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <HeaderBreadcrumbs items={breadcrumbItems} fallback={title} />
              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>
          <div className={cn("flex flex-1 flex-col", className)}>
            <main className={cn("flex-1 p-4 md:p-6", contentClassName)}>
              {children ?? <Outlet />}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </HeaderBreadcrumbOverrideContext.Provider>
  )
}

type HeaderBreadcrumbsProps = {
  items: ReturnType<typeof getConsoleBreadcrumbItems>
  fallback: string
}

function HeaderBreadcrumbs({ items, fallback }: HeaderBreadcrumbsProps) {
  if (!items.length) {
    return <h1 className="truncate text-sm font-medium">{fallback}</h1>
  }

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.title}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="truncate text-sm font-medium">
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="truncate text-sm font-medium"
                  >
                    <Link to={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
