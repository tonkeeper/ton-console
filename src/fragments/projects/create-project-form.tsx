import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { FolderPlus, ImagePlus, Loader2, X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getProjectErrorMessage } from "@/utils/projects/project-queries"

export type CreateProjectFormProps = {
  title?: string
  description?: string
  submitLabel?: string
  isPending?: boolean
  error?: unknown
  onSubmit: (values: { name: string; image?: File }) => void
}

export function CreateProjectForm({
  title = "Create a project",
  description = "Projects group TON Console tools, API keys, billing, and product settings.",
  submitLabel = "Create project",
  isPending = false,
  error,
  onSubmit,
}: CreateProjectFormProps) {
  const nameId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | undefined>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const trimmedName = name.trim()
  const nameError =
    name.length > 0 && trimmedName.length < 2
      ? "Use at least 2 characters."
      : undefined

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null)
      return
    }

    const nextPreviewUrl = URL.createObjectURL(image)
    setPreviewUrl(nextPreviewUrl)

    return () => URL.revokeObjectURL(nextPreviewUrl)
  }, [image])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (trimmedName.length < 2) {
      return
    }

    onSubmit({ name: trimmedName, image })
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Project was not created</AlertTitle>
              <AlertDescription>{getProjectErrorMessage(error)}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative size-20 shrink-0">
              <Button
                type="button"
                variant="ghost"
                className="group relative size-20 overflow-hidden rounded-lg border bg-muted p-0 text-lg font-medium hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload project icon"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <FolderPlus className="size-7 text-muted-foreground" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ImagePlus className="size-5" />
                </span>
              </Button>
              {previewUrl ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute -right-1.5 -top-1.5 z-10 size-6 rounded-full border bg-background p-0 shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                  aria-label="Remove project icon"
                  onClick={() => {
                    setImage(undefined)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  setImage(event.target.files?.[0])
                  event.target.value = ""
                }}
              />
            </div>

            <FieldGroup className="flex-1">
              <Field data-invalid={Boolean(nameError)}>
                <FieldLabel htmlFor={nameId}>Project name</FieldLabel>
                <Input
                  id={nameId}
                  autoComplete="off"
                  placeholder="Mainnet app"
                  value={name}
                  aria-invalid={Boolean(nameError)}
                  onChange={(event) => setName(event.target.value)}
                />
                <FieldError>{nameError}</FieldError>
              </Field>
              <FieldDescription className="flex items-center gap-1.5">
                <ImagePlus className="size-3.5" />
                You can add or change the icon later in project settings.
              </FieldDescription>
            </FieldGroup>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || trimmedName.length < 2}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
