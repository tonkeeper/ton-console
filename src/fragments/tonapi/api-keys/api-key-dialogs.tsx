import { useEffect, useId, useState } from "react"
import { Loader2, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useEditApiKeyMutation,
} from "@/utils/tonapi/api-keys/api-key-queries"
import {
  ApiKeyForm,
  getApiKeyFormDefaultValues,
  validateApiKeyForm,
  valuesToApiKeyPayload,
} from "./api-key-form"
import type { ApiKey, ApiKeyFormValues } from "@/utils/tonapi/api-keys/types"

type ApiKeyDialogProps = {
  open: boolean
  apiKey?: ApiKey
  onOpenChange: (open: boolean) => void
}

export function CreateApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const formId = useId()
  const createApiKey = useCreateApiKeyMutation()
  const [values, setValues] = useState<ApiKeyFormValues>(
    getApiKeyFormDefaultValues()
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApiKeyFormValues, string>>
  >({})

  useEffect(() => {
    if (!open) {
      setValues(getApiKeyFormDefaultValues())
      setErrors({})
    }
  }, [open])

  const submit = () => {
    const nextErrors = validateApiKeyForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    createApiKey.mutate(valuesToApiKeyPayload(values), {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New API key</DialogTitle>
          <DialogDescription>
            Create a TonAPI token for this project.
          </DialogDescription>
        </DialogHeader>
        <ApiKeyForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={createApiKey.isPending}
          onChange={setValues}
          onSubmit={submit}
        />
        {createApiKey.isError ? (
          <p className="text-sm text-destructive">
            {getMutationErrorMessage(createApiKey.error)}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={createApiKey.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={createApiKey.isPending}>
            {createApiKey.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EditApiKeyDialog({
  open,
  apiKey,
  onOpenChange,
}: ApiKeyDialogProps) {
  const formId = useId()
  const editApiKey = useEditApiKeyMutation()
  const [values, setValues] = useState<ApiKeyFormValues>(
    getApiKeyFormDefaultValues(apiKey)
  )
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApiKeyFormValues, string>>
  >({})

  useEffect(() => {
    setValues(getApiKeyFormDefaultValues(apiKey))
    setErrors({})
  }, [apiKey, open])

  const submit = () => {
    if (!apiKey) {
      return
    }

    const nextErrors = validateApiKeyForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    editApiKey.mutate(
      { id: apiKey.id, payload: valuesToApiKeyPayload(values) },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit API key</DialogTitle>
          <DialogDescription>
            Update access rules for this token.
          </DialogDescription>
        </DialogHeader>
        <ApiKeyForm
          formId={formId}
          values={values}
          errors={errors}
          disabled={editApiKey.isPending}
          onChange={setValues}
          onSubmit={submit}
        />
        {editApiKey.isError ? (
          <p className="text-sm text-destructive">
            {getMutationErrorMessage(editApiKey.error)}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={editApiKey.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={editApiKey.isPending}>
            {editApiKey.isPending ? <Loader2 className="animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type DeleteApiKeyDialogProps = {
  open: boolean
  apiKey?: ApiKey
  onOpenChange: (open: boolean) => void
}

export function DeleteApiKeyDialog({
  open,
  apiKey,
  onOpenChange,
}: DeleteApiKeyDialogProps) {
  const deleteApiKey = useDeleteApiKeyMutation()
  const [confirmation, setConfirmation] = useState("")

  useEffect(() => {
    if (!open) {
      setConfirmation("")
    }
  }, [open])

  const canDelete = Boolean(apiKey) && confirmation === apiKey?.name

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {apiKey?.name}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Type the key name to confirm deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field data-invalid={confirmation.length > 0 && !canDelete}>
          <FieldLabel htmlFor="delete-api-key-confirmation">
            Key name
          </FieldLabel>
          <Input
            id="delete-api-key-confirmation"
            value={confirmation}
            disabled={deleteApiKey.isPending}
            autoComplete="off"
            onChange={(event) => setConfirmation(event.target.value)}
          />
          <FieldDescription>{apiKey?.name}</FieldDescription>
          <FieldError>
            {confirmation.length > 0 && !canDelete
              ? "The key name does not match."
              : undefined}
          </FieldError>
        </Field>
        {deleteApiKey.isError ? (
          <p className="text-sm text-destructive">
            {getMutationErrorMessage(deleteApiKey.error)}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteApiKey.isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={!canDelete || deleteApiKey.isPending}
            onClick={() => {
              if (!apiKey) {
                return
              }

              deleteApiKey.mutate(apiKey.id, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {deleteApiKey.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function getMutationErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Try again."
}
