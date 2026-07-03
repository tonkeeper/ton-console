import { useId, useState, type FormEvent } from "react"
import { FolderPlus, ImagePlus, Loader2 } from "lucide-react"

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
  const imageId = useId()
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | undefined>()
  const trimmedName = name.trim()
  const nameError =
    name.length > 0 && trimmedName.length < 2
      ? "Use at least 2 characters."
      : undefined

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
        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FolderPlus className="size-4" />
        </div>
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

          <FieldGroup>
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

            <Field>
              <FieldLabel htmlFor={imageId}>Project icon</FieldLabel>
              <Input
                id={imageId}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => setImage(event.target.files?.[0])}
              />
              <FieldDescription className="flex items-center gap-1.5">
                <ImagePlus className="size-3.5" />
                You can add or change the icon later in project settings.
              </FieldDescription>
            </Field>
          </FieldGroup>

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
