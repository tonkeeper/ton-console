import {
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, CheckCircle2, MessageSquare, Send } from "lucide-react"

import { api } from "@/api/client"
import type { DTOProject, DTOUser } from "@/api/api.generated"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSessionQuery } from "@/hooks/use-auth"
import { getApiErrorMessage } from "@/lib/api-errors"

type FeedbackFormState = {
  name: string
  company: string
  tg: string
  information: string
}

export type FeedbackDialogProps = {
  source: string
  project?: DTOProject | null
  trigger?: ReactNode
}

const emptyForm: FeedbackFormState = {
  name: "",
  company: "",
  tg: "",
  information: "",
}

export function FeedbackDialog({
  source,
  project = null,
  trigger,
}: FeedbackDialogProps) {
  const session = useSessionQuery()
  const user = session.data ?? null
  const defaults = useMemo(
    () => getFeedbackDefaults(user, project),
    [project, user]
  )
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FeedbackFormState>(() => ({
    ...emptyForm,
    ...defaults,
  }))
  const [wasSent, setWasSent] = useState(false)
  const feedback = useFeedbackMutation()

  useEffect(() => {
    if (!open) {
      return
    }

    setForm((current) => ({
      ...current,
      ...defaults,
    }))
  }, [defaults, open])

  const updateField =
    (field: keyof FeedbackFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      setWasSent(false)
    }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWasSent(false)

    feedback.mutate(
      buildFeedbackPayload({
        form,
        project,
        source,
        user,
      }),
      {
        onSuccess: () => {
          setWasSent(true)
          setForm({ ...emptyForm, ...defaults, information: "" })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline">
            <MessageSquare className="size-4" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact TON Console</DialogTitle>
          <DialogDescription>
            Send a short request and the team will reply using the contact
            details you provide.
          </DialogDescription>
        </DialogHeader>

        <form id="feedback-form" className="grid gap-4" onSubmit={onSubmit}>
          {wasSent ? (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Feedback sent</AlertTitle>
              <AlertDescription>
                Thanks. We will review it and get back to you shortly.
              </AlertDescription>
            </Alert>
          ) : null}

          {feedback.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Could not send feedback</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(feedback.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field>
              <RequiredFieldLabel htmlFor="feedback-name">
                Name
              </RequiredFieldLabel>
              <Input
                id="feedback-name"
                autoComplete="name"
                value={form.name}
                onChange={updateField("name")}
                placeholder="Your name"
                aria-required="true"
                required
              />
            </Field>
            <Field>
              <RequiredFieldLabel htmlFor="feedback-company">
                Company
              </RequiredFieldLabel>
              <Input
                id="feedback-company"
                autoComplete="organization"
                value={form.company}
                onChange={updateField("company")}
                placeholder="Your company name"
                aria-required="true"
                required
              />
            </Field>
            <Field>
              <RequiredFieldLabel htmlFor="feedback-tg">
                TG handle
              </RequiredFieldLabel>
              <Input
                id="feedback-tg"
                autoComplete="off"
                value={form.tg}
                onChange={updateField("tg")}
                placeholder="Your telegram handle (like @handle)"
                aria-required="true"
                required
              />
              <FieldDescription>
                A Telegram handle is the fastest way for the team to follow up.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-information">Message</FieldLabel>
              <Textarea
                id="feedback-information"
                className="min-h-28 resize-none"
                value={form.information}
                onChange={updateField("information")}
                placeholder="Tell us what you are building or what you need help with"
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button
            form="feedback-form"
            type="submit"
            disabled={feedback.isPending}
          >
            <Send className="size-4" />
            {feedback.isPending ? "Sending" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function useFeedbackMutation() {
  return useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const response = await api.api.feedback(payload, { format: "json" })

      return response.data
    },
  })
}

function getFeedbackDefaults(user: DTOUser | null, project: DTOProject | null) {
  return {
    company: project?.name ?? "",
    name: user ? getUserName(user) : "",
    tg: "",
  }
}

function RequiredFieldLabel({
  children,
  ...props
}: ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props}>
      {children}
      <span className="text-destructive" aria-hidden="true">
        *
      </span>
    </FieldLabel>
  )
}

function buildFeedbackPayload({
  form,
  project,
  source,
  user,
}: {
  form: FeedbackFormState
  project: DTOProject | null
  source: string
  user: DTOUser | null
}) {
  return {
    name: form.name,
    company: form.company,
    tg: form.tg,
    information: form.information,
    x_source: source,
    x_path: typeof window === "undefined" ? "" : window.location.pathname,
    x_project_id: project?.id ? String(project.id) : "",
    x_project_name: project?.name ?? "",
    x_tg_user_id: user?.tg_id ? String(user.tg_id) : "",
    x_console_user_id: user?.id ? String(user.id) : "",
    x_tg_user_name: user ? getUserName(user) : "",
    x_wallet_address: user?.wallet_address ?? "",
  }
}

function getUserName(user: DTOUser) {
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.wallet_address ||
    `User #${user.id}`
  )
}
