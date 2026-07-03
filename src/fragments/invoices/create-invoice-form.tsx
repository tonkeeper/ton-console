import { DTOCryptoCurrency } from "@/api/api.generated"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type {
  CreateInvoiceErrors,
  CreateInvoiceValues,
} from "@/utils/invoices/invoice-types"
import { formatInvoiceCurrency } from "@/utils/invoices/invoice-format"

const invoiceDurationPresets = [
  { label: "Hour", value: "60" },
  { label: "6 hours", value: "360" },
  { label: "Day", value: "1440" },
  { label: "Week", value: "10080" },
  { label: "Month", value: "43200" },
] as const

export function getCreateInvoiceDefaultValues(): CreateInvoiceValues {
  return {
    amount: "",
    currency: DTOCryptoCurrency.DTO_TON,
    lifeTimeMinutes: "",
    description: "",
  }
}

export function validateCreateInvoice(values: CreateInvoiceValues) {
  const errors: CreateInvoiceErrors = {}
  const amount = Number(values.amount)
  const lifeTimeMinutes = Number(values.lifeTimeMinutes)

  if (!values.amount.trim() || Number.isNaN(amount)) {
    errors.amount = "Enter a valid amount."
  } else if (amount < 0.001) {
    errors.amount = "Amount must be at least 0.001."
  } else if (amount > 100000) {
    errors.amount = "Amount must be 100,000 or lower."
  }

  if (!values.lifeTimeMinutes.trim() || Number.isNaN(lifeTimeMinutes)) {
    errors.lifeTimeMinutes = "Enter a valid duration."
  } else if (lifeTimeMinutes <= 0) {
    errors.lifeTimeMinutes = "Duration must be greater than 0."
  } else if (lifeTimeMinutes > 60 * 24 * 90) {
    errors.lifeTimeMinutes = "Duration must be 90 days or less."
  }

  if (values.description.length > 255) {
    errors.description = "Description must be 255 characters or fewer."
  }

  return errors
}

type CreateInvoiceFormProps = {
  formId: string
  values: CreateInvoiceValues
  errors: CreateInvoiceErrors
  disabled?: boolean
  onChange: (values: CreateInvoiceValues) => void
  onSubmit: () => void
}

export function CreateInvoiceForm({
  formId,
  values,
  errors,
  disabled,
  onChange,
  onSubmit,
}: CreateInvoiceFormProps) {
  const update = <Key extends keyof CreateInvoiceValues>(
    key: Key,
    value: CreateInvoiceValues[Key]
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
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field data-invalid={Boolean(errors.amount)}>
            <FieldLabel htmlFor={`${formId}-amount`}>Amount</FieldLabel>
            <Input
              id={`${formId}-amount`}
              value={values.amount}
              disabled={disabled}
              inputMode="decimal"
              autoComplete="off"
              placeholder="10"
              onChange={(event) => update("amount", event.target.value)}
            />
            <FieldError>{errors.amount}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Select
              value={values.currency}
              disabled={disabled}
              onValueChange={(value) =>
                update("currency", value as DTOCryptoCurrency)
              }
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DTOCryptoCurrency.DTO_TON}>
                  {formatInvoiceCurrency(DTOCryptoCurrency.DTO_TON)}
                </SelectItem>
                <SelectItem value={DTOCryptoCurrency.DTO_USDT}>USDT</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.lifeTimeMinutes)}>
          <FieldLabel htmlFor={`${formId}-life-time`}>
            Duration, minutes
          </FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {invoiceDurationPresets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant={
                  values.lifeTimeMinutes === preset.value
                    ? "secondary"
                    : "outline"
                }
                size="sm"
                disabled={disabled}
                onClick={() => update("lifeTimeMinutes", preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <Input
            id={`${formId}-life-time`}
            value={values.lifeTimeMinutes}
            disabled={disabled}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Duration in minutes"
            onChange={(event) => update("lifeTimeMinutes", event.target.value)}
          />
          <FieldDescription>
            Maximum duration is 129,600 minutes, or 90 days.
          </FieldDescription>
          <FieldError>{errors.lifeTimeMinutes}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
          <Textarea
            id={`${formId}-description`}
            className="resize-none"
            value={values.description}
            disabled={disabled}
            rows={3}
            placeholder="Optional internal note"
            onChange={(event) => update("description", event.target.value)}
          />
          <FieldDescription>
            Only administrators can see this description.
          </FieldDescription>
          <FieldError>{errors.description}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}
