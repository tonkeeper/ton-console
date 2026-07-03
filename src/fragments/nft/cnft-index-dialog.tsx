import { useEffect, useId, useMemo, useRef, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  useCnftCollectionInfoMutation,
  useIndexCnftCollectionMutation,
} from "@/utils/nft/nft-queries"
import {
  formatNumber,
  formatUsdAmount,
  getApiErrorMessage,
  isTonAddress,
  normalizeTonAddress,
} from "@/utils/nft/nft-utils"
import type { CnftCollection, CnftIndexFormValues } from "@/utils/nft/types"

type CnftIndexDialogProps = {
  open: boolean
  pricePerNft?: number
  onOpenChange: (open: boolean) => void
}

type FormErrors = Partial<Record<keyof CnftIndexFormValues, string>>

const defaultValues: CnftIndexFormValues = {
  account: "",
  count: "",
}

export function CnftIndexDialog({
  open,
  pricePerNft,
  onOpenChange,
}: CnftIndexDialogProps) {
  const formId = useId()
  const [values, setValues] = useState<CnftIndexFormValues>(defaultValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [checkedCollection, setCheckedCollection] =
    useState<CnftCollection | null>(null)
  const [checkedAccount, setCheckedAccount] = useState<string | null>(null)

  const collectionInfo = useCnftCollectionInfoMutation()
  const indexCollection = useIndexCnftCollectionMutation()
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setValues(defaultValues)
      setErrors({})
      setCheckedCollection(null)
      setCheckedAccount(null)
      collectionInfo.reset()
      indexCollection.reset()
    }
    wasOpenRef.current = open
  }, [collectionInfo, indexCollection, open])

  const normalizedAccount = useMemo(() => {
    if (!isTonAddress(values.account)) {
      return null
    }

    return normalizeTonAddress(values.account)
  }, [values.account])

  const count = Number(values.count)
  const availableCount = checkedCollection
    ? checkedCollection.nft_count - checkedCollection.paid_indexing_count
    : null
  const estimatedPrice =
    pricePerNft !== undefined && Number.isFinite(count) && count > 0
      ? pricePerNft * count
      : 0

  const checkCollection = () => {
    const accountError = validateAccount(values.account)
    setErrors((current) => ({ ...current, account: accountError }))

    if (accountError || !normalizedAccount) {
      return
    }

    collectionInfo.mutate(normalizedAccount, {
      onSuccess: (collection) => {
        setCheckedCollection(collection)
        setCheckedAccount(normalizedAccount)
      },
    })
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(values, availableCount, collectionMatches)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !normalizedAccount) {
      return
    }

    indexCollection.mutate(
      { account: normalizedAccount, count },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const collectionMatches =
    checkedAccount === normalizedAccount && normalizedAccount !== null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add cNFT collection</DialogTitle>
          <DialogDescription>
            Check a collection, choose how many cNFTs to index, and pay for the
            indexing capacity.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} className="grid gap-4" noValidate onSubmit={submit}>
          <Field data-invalid={Boolean(errors.account)}>
            <FieldLabel htmlFor="cnft-account">Collection address</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="cnft-account"
                value={values.account}
                autoComplete="off"
                placeholder="0:da6b1b..."
                disabled={indexCollection.isPending}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    account: event.target.value,
                  }))
                  setCheckedCollection(null)
                  setCheckedAccount(null)
                  setErrors((current) => ({ ...current, account: undefined }))
                  collectionInfo.reset()
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={collectionInfo.isPending || indexCollection.isPending}
                onClick={checkCollection}
              >
                {collectionInfo.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
                Check
              </Button>
            </div>
            <FieldDescription>
              Enter a raw or user-friendly TON collection address.
            </FieldDescription>
            <FieldError>{errors.account}</FieldError>
          </Field>

          {collectionInfo.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Collection check failed</AlertTitle>
              <AlertDescription>
                {getApiErrorMessage(collectionInfo.error)}
              </AlertDescription>
            </Alert>
          ) : null}

          {checkedCollection && collectionMatches ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span className="font-medium">
                  {checkedCollection.name || "Untitled collection"}
                </span>
                <Badge variant="secondary">
                  {formatNumber(checkedCollection.nft_count)} total
                </Badge>
              </div>
              <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                <span>
                  Minted: {formatNumber(checkedCollection.minted_count)}
                </span>
                <span>
                  Paid: {formatNumber(checkedCollection.paid_indexing_count)}
                </span>
                <span>
                  Available: {formatNumber(Math.max(availableCount ?? 0, 0))}
                </span>
              </div>
            </div>
          ) : null}

          <Field data-invalid={Boolean(errors.count)}>
            <FieldLabel htmlFor="cnft-count">Indexing amount</FieldLabel>
            <Input
              id="cnft-count"
              value={values.count}
              inputMode="numeric"
              min={1}
              pattern="[0-9]*"
              placeholder="1000"
              disabled={indexCollection.isPending}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  count: event.target.value.replace(/\D/g, ""),
                }))
                setErrors((current) => ({ ...current, count: undefined }))
              }}
            />
            <FieldDescription>
              Estimated price: {formatUsdAmount(estimatedPrice)}
            </FieldDescription>
            <FieldError>{errors.count}</FieldError>
          </Field>
        </form>

        {indexCollection.isError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Indexing request failed</AlertTitle>
            <AlertDescription>
              {getApiErrorMessage(indexCollection.error)}
            </AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={indexCollection.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            form={formId}
            type="submit"
            disabled={indexCollection.isPending}
          >
            {indexCollection.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Add collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function validateAccount(account: string) {
  if (account.trim().length === 0) {
    return "Collection address is required."
  }

  if (!isTonAddress(account)) {
    return "Enter a valid TON address."
  }

  return undefined
}

function validateForm(
  values: CnftIndexFormValues,
  availableCount: number | null,
  collectionMatches: boolean
) {
  const errors: FormErrors = {}
  const accountError = validateAccount(values.account)

  if (accountError) {
    errors.account = accountError
  } else if (!collectionMatches) {
    errors.account = "Check this collection before adding it."
  }

  const count = Number(values.count)
  if (!Number.isInteger(count) || count <= 0) {
    errors.count = "Amount should be greater than 0."
  } else if (availableCount !== null && count > availableCount) {
    errors.count = "Amount exceeds available cNFT count."
  }

  return errors
}
