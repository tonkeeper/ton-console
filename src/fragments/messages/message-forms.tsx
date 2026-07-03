import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import type {
  MessageAppFormValues,
  MessagePushFormValues,
} from "@/utils/messages/message-types"

export function MessageAppForm({
  values,
  errors,
  disabled,
  formId,
  onChange,
  onSubmit,
}: {
  values: MessageAppFormValues
  errors: Partial<Record<keyof MessageAppFormValues, string>>
  disabled?: boolean
  formId: string
  onChange: (values: MessageAppFormValues) => void
  onSubmit: () => void
}) {
  const update = <Key extends keyof MessageAppFormValues>(
    key: Key,
    value: MessageAppFormValues[Key]
  ) => {
    onChange({ ...values, [key]: value })
  }

  return (
    <form
      id={formId}
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.manifestUrl)}>
          <FieldLabel htmlFor={`${formId}-manifest-url`}>
            TonConnect manifest or app URL
          </FieldLabel>
          <Input
            id={`${formId}-manifest-url`}
            value={values.manifestUrl}
            disabled={disabled}
            autoComplete="url"
            placeholder="https://app.example.com/tonconnect-manifest.json"
            onChange={(event) => update("manifestUrl", event.target.value)}
          />
          <FieldDescription>
            Enter a TonConnect manifest URL or the app URL. App name, URL, and
            icon are loaded from the manifest.
          </FieldDescription>
          <FieldError>{errors.manifestUrl}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function MessagePushForm({
  values,
  errors,
  disabled,
  formId,
  onChange,
  onSubmit,
}: {
  values: MessagePushFormValues
  errors: Partial<Record<keyof MessagePushFormValues, string>>
  disabled?: boolean
  formId: string
  onChange: (values: MessagePushFormValues) => void
  onSubmit: () => void
}) {
  const update = <Key extends keyof MessagePushFormValues>(
    key: Key,
    value: MessagePushFormValues[Key]
  ) => {
    onChange({ ...values, [key]: value })
  }

  return (
    <form
      id={formId}
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Field data-invalid={Boolean(errors.title)}>
        <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
        <Input
          id={`${formId}-title`}
          value={values.title}
          disabled={disabled}
          autoComplete="off"
          placeholder="Product update"
          onChange={(event) => update("title", event.target.value)}
        />
        <FieldDescription>Optional notification title.</FieldDescription>
        <FieldError>{errors.title}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.message)}>
        <FieldLabel htmlFor={`${formId}-message`}>Message</FieldLabel>
        <Textarea
          id={`${formId}-message`}
          value={values.message}
          disabled={disabled}
          placeholder="Your test message"
          rows={4}
          onChange={(event) => update("message", event.target.value)}
        />
        <FieldError>{errors.message}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.link)}>
        <FieldLabel htmlFor={`${formId}-link`}>Link</FieldLabel>
        <Input
          id={`${formId}-link`}
          value={values.link}
          disabled={disabled}
          autoComplete="url"
          placeholder="https://app.example.com/event"
          onChange={(event) => update("link", event.target.value)}
        />
        <FieldDescription>
          Optional action URL opened in Tonkeeper dApp Browser.
        </FieldDescription>
        <FieldError>{errors.link}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.addresses)}>
        <FieldLabel htmlFor={`${formId}-addresses`}>Recipients</FieldLabel>
        <Textarea
          id={`${formId}-addresses`}
          value={values.addresses}
          disabled={disabled}
          placeholder={"EQ...\nEQ..."}
          rows={3}
          onChange={(event) => update("addresses", event.target.value)}
        />
        <FieldDescription>
          Optional wallet addresses, one per line or comma separated. Leave
          blank to send to all users with notifications enabled.
        </FieldDescription>
        <FieldError>{errors.addresses}</FieldError>
      </Field>
    </form>
  )
}
