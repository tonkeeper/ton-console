import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import copyToClipboard from "copy-to-clipboard"
import {
  Copy,
  ImagePlus,
  Loader2,
  Plus,
  ShieldAlert,
  Trash2,
  UserRoundPlus,
  X,
} from "lucide-react"

import type { DTOParticipant, DTOProject, DTOUser } from "@/api/api.generated"
import {
  useAddProjectParticipantMutation,
  useCurrentUserQuery,
  useDeleteProjectMutation,
  useDeleteProjectParticipantMutation,
  useProjectParticipantsQuery,
  useSelectedProject,
  useUpdateProjectMutation,
} from "@/hooks/use-project"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ProjectFormState = {
  name: string
}

const isDeleteProjectAvailable =
  import.meta.env.VITE_AVAILABLE_DELETE_PROJECT === "true"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (!parts.length) {
    return "TC"
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function getParticipantName(participant: DTOParticipant | DTOUser) {
  return (
    [participant.first_name, participant.last_name].filter(Boolean).join(" ") ||
    `User #${participant.id}`
  )
}

function formatDate(value?: number) {
  if (!value) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function getProjectAvatar(
  project: DTOProject | null,
  previewUrl: string | null
) {
  if (previewUrl) {
    return previewUrl
  }

  return project?.avatar ?? null
}

export function SettingsPage() {
  const {
    selectedProject,
    setSelectedProjectId,
    isLoading: projectsLoading,
    isError: projectsFailed,
    error: projectsError,
  } = useSelectedProject()
  const currentUserQuery = useCurrentUserQuery()

  return (
    <div className="flex w-full flex-col gap-4">
      <PageHeader
        title="Settings"
        description="Project identity and access settings."
      />

      {projectsFailed ? (
        <Card>
          <CardHeader>
            <CardTitle>Projects unavailable</CardTitle>
            <CardDescription>
              {getErrorMessage(projectsError) ??
                "Project data could not be loaded from the API."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {projectsLoading ? <SettingsSkeleton /> : null}

      {!projectsLoading && !projectsFailed && !selectedProject ? (
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImagePlus />
            </EmptyMedia>
            <EmptyTitle>No project selected</EmptyTitle>
            <EmptyDescription>
              Connect with an authenticated account that has at least one TON
              Console project.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {selectedProject ? (
        <>
          <ProjectDetailsCard project={selectedProject} />
          <ParticipantsCard
            projectId={selectedProject.id}
            currentUser={currentUserQuery.data ?? null}
            currentUserLoading={currentUserQuery.isLoading}
          />
          {isDeleteProjectAvailable ? (
            <DangerZoneCard
              project={selectedProject}
              onDeleted={() => setSelectedProjectId(null)}
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

function ProjectDetailsCard({ project }: { project: DTOProject }) {
  const updateProject = useUpdateProjectMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProjectFormState>({ name: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    setForm({ name: project.name })
    setImageFile(null)
    setImageRemoved(false)
    setStatus(null)
  }, [project])

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null)
      return
    }

    const nextPreviewUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(nextPreviewUrl)

    return () => URL.revokeObjectURL(nextPreviewUrl)
  }, [imageFile])

  const nameError = getProjectNameError(form.name)
  const avatarUrl = imageRemoved ? null : getProjectAvatar(project, previewUrl)
  const hasChanges =
    form.name !== project.name || imageFile !== null || imageRemoved

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImageFile(file)
    setImageRemoved(false)
    event.target.value = ""
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    if (nameError || !hasChanges) {
      return
    }

    updateProject.mutate(
      {
        projectId: project.id,
        ...(form.name !== project.name ? { name: form.name.trim() } : {}),
        ...(imageFile ? { image: imageFile } : {}),
        ...(imageRemoved ? { removeImage: true } : {}),
      },
      {
        onSuccess: () => {
          setImageFile(null)
          setImageRemoved(false)
          setStatus("Project updated.")
        },
        onError: (error) => {
          setStatus(getErrorMessage(error) ?? "Project was not updated.")
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project details</CardTitle>
        <CardDescription>
          Created {formatDate(project.date_create)}
        </CardDescription>
        <CardAction>
          <ProjectIdButton projectId={project.id} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-start gap-3">
              <div className="relative size-20 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  className="group relative size-20 overflow-hidden rounded-lg border bg-muted p-0 text-lg font-medium hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload project icon"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    getInitials(project.name)
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ImagePlus className="size-5" />
                  </span>
                </Button>
                {avatarUrl ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -right-1.5 -top-1.5 z-10 size-6 rounded-full border bg-background p-0 shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Remove project icon"
                    onClick={() => {
                      setImageFile(null)
                      setImageRemoved(true)
                    }}
                  >
                    <X className="size-3.5" />
                  </Button>
                ) : null}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <FieldGroup className="flex-1">
              <Field data-invalid={Boolean(nameError)}>
                <FieldLabel htmlFor="project-name">Project name</FieldLabel>
                <Input
                  id="project-name"
                  value={form.name}
                  autoComplete="off"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  aria-invalid={Boolean(nameError)}
                />
                <FieldError>{nameError}</FieldError>
              </Field>
            </FieldGroup>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {status ?? "Only changed fields are sent to the API."}
            </div>
            <Button
              type="submit"
              disabled={
                !hasChanges || Boolean(nameError) || updateProject.isPending
              }
            >
              {updateProject.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ParticipantsCard({
  projectId,
  currentUser,
  currentUserLoading,
}: {
  projectId: number
  currentUser: DTOUser | null
  currentUserLoading: boolean
}) {
  const participantsQuery = useProjectParticipantsQuery(projectId)
  const [dialogOpen, setDialogOpen] = useState(false)

  const participants = useMemo(() => {
    return [...(participantsQuery.data ?? [])].sort((first, second) => {
      if (first.id === currentUser?.id) {
        return -1
      }

      if (second.id === currentUser?.id) {
        return 1
      }

      return getParticipantName(first).localeCompare(getParticipantName(second))
    })
  }, [currentUser?.id, participantsQuery.data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team access</CardTitle>
        <CardDescription>
          Users with direct access to this project.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDialogOpen(true)}
          >
            <Plus />
            Add user
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {participantsQuery.isLoading || currentUserLoading ? (
          <div className="grid gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : null}

        {participantsQuery.isError ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShieldAlert />
              </EmptyMedia>
              <EmptyTitle>Participants unavailable</EmptyTitle>
              <EmptyDescription>
                {getErrorMessage(participantsQuery.error) ??
                  "The API did not return team access data."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!participantsQuery.isLoading &&
        !participantsQuery.isError &&
        participants.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRoundPlus />
              </EmptyMedia>
              <EmptyTitle>No participants found</EmptyTitle>
              <EmptyDescription>
                Add a user by numeric user id when project access management is
                available for this account.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {participants.length > 0 ? (
          <Table>
            <TableHeader className="[&_tr:hover]:!bg-transparent">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">ID</TableHead>
                <TableHead className="hidden md:table-cell">
                  Permissions
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <ParticipantRow
                  key={participant.id}
                  participant={participant}
                  projectId={projectId}
                  isCurrentUser={participant.id === currentUser?.id}
                />
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
      <AddParticipantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        participants={participantsQuery.data ?? []}
      />
    </Card>
  )
}

function ParticipantRow({
  participant,
  projectId,
  isCurrentUser,
}: {
  participant: DTOParticipant
  projectId: number
  isCurrentUser: boolean
}) {
  const deleteParticipant = useDeleteProjectParticipantMutation(projectId)
  const name = getParticipantName(participant)

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar>
            <AvatarImage src={participant.avatar} alt="" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">{name}</div>
            {isCurrentUser ? (
              <div className="text-xs text-muted-foreground">You</div>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden font-mono text-xs sm:table-cell">
        {participant.id}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {participant.permissions.length ? (
            participant.permissions.map((permission) => (
              <Badge key={permission} variant="secondary">
                {permission}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Default</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {!isCurrentUser ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={deleteParticipant.isPending}
              >
                <Trash2 />
                <span className="sr-only">Remove user</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Remove user?</AlertDialogTitle>
                <AlertDialogDescription>
                  {name} will no longer have direct access to this project.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteParticipant.mutate(participant.id)}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </TableCell>
    </TableRow>
  )
}

function AddParticipantDialog({
  open,
  onOpenChange,
  projectId,
  participants,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number
  participants: DTOParticipant[]
}) {
  const addParticipant = useAddProjectParticipantMutation(projectId)
  const [userId, setUserId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericUserId = Number(userId)

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      setError("Enter a valid numeric user id.")
      return
    }

    if (participants.some((participant) => participant.id === numericUserId)) {
      setError("This user already has access.")
      return
    }

    setError(null)
    addParticipant.mutate(numericUserId, {
      onSuccess: () => {
        setUserId("")
        onOpenChange(false)
      },
      onError: (mutationError) => {
        setError(getErrorMessage(mutationError) ?? "User was not added.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Grant project access by numeric TON Console user id.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-participant-form"
          className="grid gap-4"
          onSubmit={handleSubmit}
        >
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="participant-user-id">User ID</FieldLabel>
            <Input
              id="participant-user-id"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              aria-invalid={Boolean(error)}
              autoFocus
            />
            <FieldError>{error}</FieldError>
          </Field>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-participant-form"
            disabled={addParticipant.isPending}
          >
            {addParticipant.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DangerZoneCard({
  project,
  onDeleted,
}: {
  project: DTOProject
  onDeleted: () => void
}) {
  const deleteProject = useDeleteProjectMutation()
  const [confirmName, setConfirmName] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const canDelete = confirmName === project.name

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Permanently delete this project and its associated data.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {status ? <p className="text-sm text-destructive">{status}</p> : null}
        <AlertDialog
          onOpenChange={(open) => {
            if (!open) {
              setConfirmName("")
              setStatus(null)
            }
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-fit">
              <Trash2 />
              Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete {project.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Type the project name to confirm deletion.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Field data-invalid={confirmName.length > 0 && !canDelete}>
              <FieldLabel htmlFor="delete-project-confirmation">
                Project name
              </FieldLabel>
              <Input
                id="delete-project-confirmation"
                value={confirmName}
                onChange={(event) => setConfirmName(event.target.value)}
                aria-invalid={confirmName.length > 0 && !canDelete}
              />
              <FieldError>
                {confirmName.length > 0 && !canDelete
                  ? "Project name does not match."
                  : null}
              </FieldError>
            </Field>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={!canDelete || deleteProject.isPending}
                onClick={(event) => {
                  event.preventDefault()
                  deleteProject.mutate(project.id, {
                    onSuccess: onDeleted,
                    onError: (error) =>
                      setStatus(
                        getErrorMessage(error) ?? "Project was not deleted."
                      ),
                  })
                }}
              >
                {deleteProject.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

function ProjectIdButton({ projectId }: { projectId: number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(String(projectId))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      <Copy />
      {copied ? "Copied" : `ID ${projectId}`}
    </Button>
  )
}

function SettingsSkeleton() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
      </Card>
    </div>
  )
}

function getProjectNameError(name: string) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    return "Project name is required."
  }

  if (trimmedName.length < 3) {
    return "Minimum length is 3 characters."
  }

  if (trimmedName.length > 64) {
    return "Maximum length is 64 characters."
  }

  return null
}

function getErrorMessage(error: unknown) {
  if (!error) {
    return null
  }

  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === "object" &&
    "error" in error &&
    typeof error.error === "object" &&
    error.error &&
    "error" in error.error
  ) {
    return String(error.error.error)
  }

  return null
}
