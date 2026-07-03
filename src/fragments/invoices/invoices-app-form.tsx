import type { InvoicesAppErrors, InvoicesAppValues } from "@/utils/invoices/invoice-types"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function getInvoicesAppDefaultValues(): InvoicesAppValues {
  return {
    name: "",
    description: "",
    recipientAddress: "",
  }
}

export function validateInvoicesApp(values: InvoicesAppValues) {
  const errors: InvoicesAppErrors = {}

  if (!values.name.trim()) {
    errors.name = "Name is required."
  } else if (values.name.trim().length > 64) {
    errors.name = "Name must be 64 characters or fewer."
  }

  if (!values.recipientAddress.trim()) {
    errors.recipientAddress = "Recipient address is required."
  } else if (values.recipientAddress.trim().length < 24) {
    errors.recipientAddress = "Enter a valid TON recipient address."
  }

  if (values.description.length > 255) {
    errors.description = "Description must be 255 characters or fewer."
  }

  return errors
}

type InvoicesAppFormProps = {
  formId: string
  values: InvoicesAppValues
  errors: InvoicesAppErrors
  disabled?: boolean
  onChange: (values: InvoicesAppValues) => void
  onSubmit: () => void
}

export function InvoicesAppForm({
  formId,
  values,
  errors,
  disabled,
  onChange,
  onSubmit,
}: InvoicesAppFormProps) {
  const update = <Key extends keyof InvoicesAppValues>(
    key: Key,
    value: InvoicesAppValues[Key]
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
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor={`${formId}-name`}>App name</FieldLabel>
          <Input
            id={`${formId}-name`}
            value={values.name}
            disabled={disabled}
            autoComplete="off"
            placeholder="Store payments"
            onChange={(event) => update("name", event.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.recipientAddress)}>
          <FieldLabel htmlFor={`${formId}-recipient`}>Recipient address</FieldLabel>
          <Input
            id={`${formId}-recipient`}
            value={values.recipientAddress}
            disabled={disabled}
            autoComplete="off"
            placeholder="UQ..."
            onChange={(event) =>
              update("recipientAddress", event.target.value)
            }
          />
          <FieldDescription>
            Invoice payments will be sent to this TON address.
          </FieldDescription>
          <FieldError>{errors.recipientAddress}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
          <Textarea
            id={`${formId}-description`}
            className="resize-none"
            value={values.description}
            disabled={disabled}
            rows={3}
            placeholder="Optional internal description"
            onChange={(event) => update("description", event.target.value)}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}
