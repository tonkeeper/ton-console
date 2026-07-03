import { useState, type ComponentProps, type ReactNode } from "react"
import {
  Bell,
  BarChart3,
  ChevronRight,
  ChevronsUpDown,
  Coins,
  Copy,
  CreditCard,
  FolderPlus,
  Droplets,
  FileSearch,
  Gauge,
  Gem,
  Gift,
  HandCoins,
  History,
  Images,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Network,
  Package,
  ReceiptText,
  Server,
  Settings,
  SquarePen,
  Tags,
  UserRound,
  WalletCards,
  Webhook,
  type LucideIcon,
} from "lucide-react"
import copyToClipboard from "copy-to-clipboard"
import { Link, useLocation, useNavigate } from "react-router"

import TonConsoleLogo from "@/assets/ton-console-logo.svg"
import {
  DTOProjectCapabilitiesEnum,
  type DTOProject,
  type DTOUser,
} from "@/api/api.generated"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogoutMutation, useSessionQuery } from "@/hooks/use-auth"
import { useSelectedProject } from "@/hooks/use-project"
import { CreateProjectForm } from "@/fragments/projects/create-project-form"
import {
  getProjectAccent,
  getProjectInitials as getProjectAvatarInitials,
} from "@/utils/projects/project-format"
import { useCreateProjectMutation } from "@/utils/projects/project-queries"
import { cn } from "@/lib/utils"

export type ConsoleNavigationItem = {
  title: string
  href: string
  icon?: LucideIcon
}

export type ConsoleNavigationSection = {
  title: string
  icon: LucideIcon
  href?: string
  items: ConsoleNavigationItem[]
}

export type ConsoleNavigationGroup = {
  title: string
  items: ConsoleNavigationSection[]
}

export const consoleNavigationGroups = [
  {
    title: "Console",
    items: [
      {
        title: "Dashboard",
        icon: Gauge,
        href: "/dashboard",
        items: [],
      },
      {
        title: "Analytics",
        icon: BarChart3,
        href: "/analytics",
        items: [
          {
            title: "History",
            href: "/analytics/history",
            icon: History,
          },
          {
            title: "Query",
            href: "/analytics/query",
            icon: FileSearch,
          },
          {
            title: "Graph",
            href: "/analytics/graph",
            icon: Network,
          },
        ],
      },
      {
        title: "TonAPI",
        icon: WalletCards,
        href: "/tonapi",
        items: [
          {
            title: "API keys",
            href: "/tonapi/api-keys",
            icon: KeyRound,
          },
          {
            title: "Webhooks",
            href: "/tonapi/webhooks",
            icon: Webhook,
          },
          {
            title: "Liteservers",
            href: "/tonapi/liteservers",
            icon: Server,
          },
          {
            title: "Pricing",
            href: "/tonapi/pricing",
            icon: Tags,
          },
        ],
      },
      {
        title: "Tonkeeper Messages",
        icon: Bell,
        href: "/messages",
        items: [],
      },
      {
        title: "Invoices",
        icon: ReceiptText,
        href: "/invoices",
        items: [
          {
            title: "Overview",
            href: "/invoices/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Manage",
            href: "/invoices/manage",
            icon: ListChecks,
          },
        ],
      },
      {
        title: "Settings",
        icon: Settings,
        items: [
          {
            title: "Project settings",
            href: "/settings",
            icon: SquarePen,
          },
          {
            title: "Balance/Billing",
            href: "/billing",
            icon: CreditCard,
          },
        ],
      },
    ],
  },
  {
    title: "Assets",
    items: [
      {
        title: "NFT",
        icon: Gem,
        items: [
          {
            title: "cNFT",
            href: "/nft",
            icon: Images,
          },
        ],
      },
      {
        title: "Jetton",
        icon: Coins,
        items: [
          {
            title: "Minter",
            href: "/jetton/minter",
            icon: Package,
          },
          {
            title: "Airdrops",
            href: "/jetton/airdrops",
            icon: Gift,
          },
        ],
      },
      {
        title: "Faucet",
        icon: Droplets,
        items: [
          {
            title: "Testnet coins",
            href: "/faucet",
            icon: HandCoins,
          },
        ],
      },
    ],
  },
] satisfies ConsoleNavigationGroup[]

export const consoleSettingsNavigation = {
  title: "Settings",
  href: "/settings",
  icon: Settings,
} satisfies ConsoleNavigationItem

export type ConsoleBreadcrumbItem = {
  title: string
  href?: string
}

type ConsoleNavigationMatch = {
  section: ConsoleNavigationSection
  item: ConsoleNavigationItem | null
  hrefLength: number
}

export function getConsoleBreadcrumbItems(
  pathname: string,
  search = "",
  groups: ConsoleNavigationGroup[] = consoleNavigationGroups,
  footerItem?: ConsoleNavigationItem
): ConsoleBreadcrumbItem[] {
  if (footerItem && isNavigationItemActive(pathname, footerItem.href)) {
    return [{ title: footerItem.title }]
  }

  const webhookDetailMatch = pathname.match(/^\/tonapi\/webhooks\/([^/]+)$/)

  if (webhookDetailMatch) {
    return [
      { title: "TonAPI", href: "/tonapi" },
      { title: "Webhooks", href: getWebhooksBreadcrumbHref(search) },
      { title: `#${webhookDetailMatch[1]}` },
    ]
  }

  if (pathname === "/jetton/airdrops/create") {
    return [
      { title: "Jetton", href: "/jetton" },
      { title: "Airdrops", href: "/jetton/airdrops" },
      { title: "New Airdrop" },
    ]
  }

  const airdropDetailMatch = pathname.match(/^\/jetton\/airdrops\/([^/]+)$/)

  if (airdropDetailMatch) {
    return [
      { title: "Jetton", href: "/jetton" },
      { title: "Airdrops", href: "/jetton/airdrops" },
      { title: airdropDetailMatch[1] },
    ]
  }

  const matches: ConsoleNavigationMatch[] = []

  for (const group of groups) {
    for (const section of group.items) {
      for (const item of section.items) {
        if (isNavigationItemActive(pathname, item.href)) {
          matches.push({
            section,
            item,
            hrefLength: item.href.length,
          })
        }
      }

      if (
        section.href &&
        isNavigationItemActive(pathname, section.href) &&
        !section.items.some((item) => isNavigationItemActive(pathname, item.href))
      ) {
        matches.push({
          section,
          item: null,
          hrefLength: section.href.length,
        })
      }
    }
  }

  const match = matches.sort((a, b) => b.hrefLength - a.hrefLength)[0]

  if (!match) {
    return []
  }

  if (!match.item) {
    return [{ title: match.section.title }]
  }

  return [
    { title: match.section.title, href: match.section.href },
    { title: match.item.title },
  ]
}

function getWebhooksBreadcrumbHref(search: string) {
  const network = new URLSearchParams(search).get("network")

  return network === "testnet"
    ? "/tonapi/webhooks?network=testnet"
    : "/tonapi/webhooks"
}

export type ConsoleSidebarProps = ComponentProps<typeof Sidebar> & {
  groups?: ConsoleNavigationGroup[]
  footerItem?: ConsoleNavigationItem
  header?: ReactNode
}

export function ConsoleSidebar({
  groups = consoleNavigationGroups,
  footerItem,
  header,
  className,
  ...props
}: ConsoleSidebarProps) {
  const location = useLocation()
  const selectedProject = useSelectedProject()
  const effectiveGroups =
    groups === consoleNavigationGroups
      ? getConsoleNavigationGroupsForProject(selectedProject.selectedProject)
      : groups

  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      <SidebarHeader className="border-b p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        {header ?? <ConsoleSidebarBrand />}
        <ConsoleProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {effectiveGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <ConsoleSidebarSection
                    key={item.title}
                    section={item}
                    pathname={location.pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <ConsoleUserMenu />
        {footerItem ? (
          <SidebarMenu>
            <ConsoleSidebarItem
              item={footerItem}
              isActive={isNavigationItemActive(
                location.pathname,
                footerItem.href
              )}
            />
          </SidebarMenu>
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function getConsoleNavigationGroupsForProject(
  project: DTOProject | null
): ConsoleNavigationGroup[] {
  const hasInvoicesCapability =
    project?.capabilities.includes(DTOProjectCapabilitiesEnum.DTOInvoices) ??
    false

  return consoleNavigationGroups.map((group) => ({
    ...group,
    items: group.items.map((section) => {
      if (section.title !== "Invoices" || hasInvoicesCapability) {
        return section
      }

      return {
        ...section,
        href: "/invoices",
        items: [],
      }
    }),
  }))
}

type ConsoleSidebarSectionProps = {
  section: ConsoleNavigationSection
  pathname: string
}

function ConsoleSidebarSection({
  section,
  pathname,
}: ConsoleSidebarSectionProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const Icon = section.icon
  const isActive = isNavigationSectionActive(pathname, section)
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  if (section.href && section.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={section.title}>
          <Link to={section.href} onClick={closeMobileSidebar}>
            <Icon />
            <span>{section.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={isActive} tooltip={section.title}>
            <Icon />
            <span>{section.title}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {section.items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isNavigationItemActive(pathname, item.href)}
                >
                  <Link to={item.href} onClick={closeMobileSidebar}>
                    {item.icon ? <item.icon /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

type ConsoleSidebarItemProps = {
  item: ConsoleNavigationItem
  isActive: boolean
}

function ConsoleSidebarItem({ item, isActive }: ConsoleSidebarItemProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link
          to={item.href}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false)
            }
          }}
        >
          {Icon ? <Icon /> : null}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function ConsoleProjectSwitcher() {
  const { isMobile, setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const createProject = useCreateProjectMutation()
  const {
    projects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
    isLoading,
    isError,
  } = useSelectedProject()

  function openCreateProjectDialog() {
    setCreateProjectOpen(true)
  }

  function handleCreateProject(values: { name: string; image?: File }) {
    createProject.mutate(values, {
      onSuccess: (project) => {
        setSelectedProjectId(project.id)
        setCreateProjectOpen(false)
        if (isMobile) {
          setOpenMobile(false)
        }
        navigate("/dashboard")
      },
    })
  }

  const createProjectDialog = (
    <CreateProjectDialog
      open={createProjectOpen}
      error={createProject.error}
      isPending={createProject.isPending}
      onOpenChange={setCreateProjectOpen}
      onSubmit={handleCreateProject}
    />
  )

  if (isLoading) {
    return (
      <>
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuItem>
            <SidebarMenuButton disabled tooltip="Loading projects">
              <Loader2 className="animate-spin" />
              <span>Loading projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {createProjectDialog}
      </>
    )
  }

  if (isError) {
    return (
      <>
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuItem>
            <SidebarMenuButton disabled tooltip="Projects unavailable">
              <FolderPlus />
              <span>Projects unavailable</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {createProjectDialog}
      </>
    )
  }

  if (!projects.length) {
    return (
      <>
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Create project"
              onClick={openCreateProjectDialog}
            >
              <FolderPlus />
              <span>Create project</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {createProjectDialog}
      </>
    )
  }

  return (
    <>
      <SidebarMenu className="group-data-[collapsible=icon]:hidden">
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                tooltip={selectedProject?.name ?? "Project"}
              >
                {selectedProject ? (
                  <ProjectIcon project={selectedProject} className="size-8" />
                ) : (
                  <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                    P
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-left">
                  {selectedProject?.name ?? "Select project"}
                </span>
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            >
              <DropdownMenuLabel>Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedProjectId ? String(selectedProjectId) : ""}
                onValueChange={(value) => {
                  setSelectedProjectId(Number(value))

                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
              >
                {projects.map((project) => (
                  <DropdownMenuRadioItem
                    key={project.id}
                    value={String(project.id)}
                    className="min-w-0 gap-2 py-1.5"
                  >
                    <ProjectIcon project={project} className="size-6" />
                    <span className="truncate">{project.name}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={openCreateProjectDialog}>
                <FolderPlus className="size-4" />
                Create project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {createProjectDialog}
    </>
  )
}

function CreateProjectDialog({
  open,
  error,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  error: unknown
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { name: string; image?: File }) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a TON Console project workspace.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          isPending={isPending}
          error={error}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

function ProjectIcon({
  project,
  className,
}: {
  project: DTOProject
  className?: string
}) {
  return (
    <Avatar className={cn("rounded-md", className)}>
      <AvatarImage src={project.avatar} alt="" />
      <AvatarFallback
        className="rounded-md text-xs font-semibold text-white"
        style={{ backgroundColor: getProjectAccent(project), color: "#fff" }}
      >
        {getProjectAvatarInitials(project) || "P"}
      </AvatarFallback>
    </Avatar>
  )
}

function ConsoleUserMenu() {
  const { isMobile, setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const session = useSessionQuery()
  const logout = useLogoutMutation()
  const user = session.data ?? null
  const userName = getUserName(user)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={userName}
              className="h-11 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:p-0!"
            >
              <Avatar className="size-7 rounded-md">
                <AvatarImage src={user?.avatar} alt="" />
                <AvatarFallback className="rounded-md text-xs">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate text-left group-data-[collapsible=icon]:hidden">
                {userName}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
            className="w-56"
          >
            <DropdownMenuLabel className="truncate">
              {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
              >
                <UserRound className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {user ? (
              <DropdownMenuItem
                onSelect={() => copyToClipboard(String(user.id))}
              >
                <Copy className="size-4" />
                Copy ID
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              variant="destructive"
              disabled={logout.isPending}
              onSelect={(event) => {
                event.preventDefault()
                logout.mutate(undefined, {
                  onSettled: () => navigate("/login", { replace: true }),
                })
              }}
            >
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ConsoleSidebarBrand() {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Link
      to="/dashboard"
      onClick={() => {
        if (isMobile) {
          setOpenMobile(false)
        }
      }}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5",
        "text-sm font-medium text-sidebar-foreground",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground dark:bg-white">
        <span className="flex size-6 items-center justify-center" aria-hidden="true">
          <TonConsoleLogo />
        </span>
      </span>
      <span className="truncate group-data-[collapsible=icon]:hidden">
        TON Console
      </span>
    </Link>
  )
}

function getUserName(user: DTOUser | null) {
  if (!user) {
    return "Account"
  }

  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.wallet_address ||
    `User #${user.id}`
  )
}

function getUserInitials(user: DTOUser | null) {
  const name = getUserName(user)
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (!parts.length || name.startsWith("0:")) {
    return "TC"
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function isNavigationSectionActive(
  pathname: string,
  section: ConsoleNavigationSection
) {
  return (
    (section.href ? isNavigationItemActive(pathname, section.href) : false) ||
    section.items.some((item) => isNavigationItemActive(pathname, item.href))
  )
}
