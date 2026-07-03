import { DTOTokenCapability } from "@/api/api.generated"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import type { ApiKey, ApiKeyFormValues, ApiKeyPayload } from "@/utils/tonapi/api-keys/types"

const DEFAULT_MAX_RPS = 100000

export function getApiKeyFormDefaultValues(apiKey?: ApiKey): ApiKeyFormValues {
  const isIpLimited = apiKey?.limitRps !== undefined

  return {
    name: apiKey?.name ?? "",
    mode: isIpLimited ? "ip" : "unlimited",
    limitRps: apiKey?.limitRps?.toString() ?? "1",
    origins: apiKey?.origins.join("\n") ?? "",
    cocoon:
      apiKey?.capabilities.includes(DTOTokenCapability.DTOCocoon) ?? false,
  }
}

export function valuesToApiKeyPayload(values: ApiKeyFormValues): ApiKeyPayload {
  const name = values.name.trim()

  if (values.mode === "ip") {
    return {
      name,
      limitRps: Number(values.limitRps),
      origins: values.origins
        .split("\n")
        .map((origin) => origin.trim())
        .filter(Boolean),
      capabilities: [],
    }
  }

  return {
    name,
    capabilities: values.cocoon ? [DTOTokenCapability.DTOCocoon] : [],
  }
}

export function validateApiKeyForm(values: ApiKeyFormValues) {
  const errors: Partial<Record<keyof ApiKeyFormValues, string>> = {}
  const name = values.name.trim()

  if (!name) {
    errors.name = "Name is required."
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters."
  } else if (name.length > 64) {
    errors.name = "Name must be 64 characters or fewer."
  }

  if (values.mode === "ip") {
    const limit = Number(values.limitRps)

    if (!values.limitRps.trim() || Number.isNaN(limit)) {
      errors.limitRps = "Enter a valid request limit."
    } else if (limit < 0.1) {
      errors.limitRps = "Limit must be at least 0.1 RPS."
    } else if (limit > DEFAULT_MAX_RPS) {
      errors.limitRps = `Limit must be ${DEFAULT_MAX_RPS} RPS or lower.`
    }

    const origins = values.origins.split("\n").filter((origin) => origin.trim())
    if (origins.length > 20) {
      errors.origins = "Enter up to 20 origins."
    }
  }

  return errors
}

export type ApiKeyFormProps = {
  values: ApiKeyFormValues
  errors: Partial<Record<keyof ApiKeyFormValues, string>>
  disabled?: boolean
  formId: string
  onChange: (values: ApiKeyFormValues) => void
  onSubmit: () => void
}

export function ApiKeyForm({
  values,
  errors,
  disabled,
  formId,
  onChange,
  onSubmit,
}: ApiKeyFormProps) {
  const update = <Key extends keyof ApiKeyFormValues>(
    key: Key,
    value: ApiKeyFormValues[Key]
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
      <Field data-invalid={Boolean(errors.name)}>
        <FieldLabel htmlFor={`${formId}-name`}>Name</FieldLabel>
        <Input
          id={`${formId}-name`}
          value={values.name}
          disabled={disabled}
          autoComplete="off"
          placeholder="Production key"
          onChange={(event) => update("name", event.target.value)}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <FieldSet>
        <RadioGroup
          value={values.mode}
          disabled={disabled}
          onValueChange={(value) =>
            update("mode", value === "ip" ? "ip" : "unlimited")
          }
        >
          <FieldLabel className="rounded-lg border p-3">
            <RadioGroupItem value="unlimited" />
            <FieldContent>
              <FieldTitle>Unlimited</FieldTitle>
              <FieldDescription>
                Suitable for backend services and scripts. This key is governed
                by the project plan and should not be exposed in client-side
                code.
              </FieldDescription>
            </FieldContent>
          </FieldLabel>
          <FieldLabel className="rounded-lg border p-3">
            <RadioGroupItem value="ip" />
            <FieldContent>
              <FieldTitle>Limited by IP</FieldTitle>
              <FieldDescription>
                Suitable for frontend use. Requests can be limited per IP and
                optionally restricted to specific origins.
              </FieldDescription>
            </FieldContent>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>

      {values.mode === "ip" ? (
        <FieldGroup>
          <Field data-invalid={Boolean(errors.limitRps)}>
            <FieldLabel htmlFor={`${formId}-limit-rps`}>
              Requests per second
            </FieldLabel>
            <Input
              id={`${formId}-limit-rps`}
              value={values.limitRps}
              disabled={disabled}
              inputMode="decimal"
              placeholder="1"
              onChange={(event) => update("limitRps", event.target.value)}
            />
            <FieldDescription>
              Min 0.1, max {DEFAULT_MAX_RPS.toLocaleString()} RPS.
            </FieldDescription>
            <FieldError>{errors.limitRps}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.origins)}>
            <FieldLabel htmlFor={`${formId}-origins`}>Origins</FieldLabel>
            <Textarea
              id={`${formId}-origins`}
              value={values.origins}
              disabled={disabled}
              placeholder={"https://example.com\nhttps://app.example.com"}
              rows={4}
              onChange={(event) => update("origins", event.target.value)}
            />
            <FieldDescription>
              Enter up to 20 allowed origins, one per line.
            </FieldDescription>
            <FieldError>{errors.origins}</FieldError>
          </Field>
        </FieldGroup>
      ) : (
        <FieldLabel className="rounded-lg border p-3">
          <Checkbox
            checked={values.cocoon}
            disabled={disabled}
            onCheckedChange={(checked) => update("cocoon", checked === true)}
          />
          <FieldContent>
            <FieldTitle>Allow Cocoon</FieldTitle>
            <FieldDescription>
              Let this key access Cocoon API capabilities.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      )}
    </form>
  )
}
