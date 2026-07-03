import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { api } from "@/api/client"
import {
  DTOBillingTransactionTypeEnum,
  DTOCryptoCurrency,
  type DTOBillingTransaction,
} from "@/api/api.generated"
import { useSelectedProject } from "@/hooks/use-project"

const EXPORT_PAGE_SIZE = 500
const MIN_REQUEST_INTERVAL_MS = Math.ceil(1000 / 3)

const CSV_HEADERS = [
  "Transaction ID",
  "Created At (ISO)",
  "Type",
  "Reason",
  "Description",
  "Signed Amount",
  "Currency",
  "Metadata",
] as const

export function useBillingCsvExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportedCount, setExportedCount] = useState(0)
  const isMountedRef = useRef(true)
  const { selectedProject, selectedProjectId: projectId } = useSelectedProject()
  const selectedProjectName = selectedProject?.name ?? "unknown"

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const exportFullHistory = useCallback(async () => {
    if (!projectId || isExporting) {
      return
    }

    setIsExporting(true)
    setExportedCount(0)

    const allItems: DTOBillingTransaction[] = []
    let beforeTx: string | undefined
    let lastRequestTime = 0

    try {
      while (true) {
        const now = Date.now()
        if (lastRequestTime) {
          const elapsed = now - lastRequestTime
          if (elapsed < MIN_REQUEST_INTERVAL_MS) {
            await delay(MIN_REQUEST_INTERVAL_MS - elapsed)
          }
        }

        lastRequestTime = Date.now()

        const response = await api.api.getProjectBillingHistory(
          projectId,
          {
            before_tx: beforeTx,
            limit: EXPORT_PAGE_SIZE,
          },
          { format: "json" }
        )

        const currentPage = response.data.history

        if (!currentPage.length) {
          break
        }

        allItems.push(...currentPage)

        if (isMountedRef.current) {
          setExportedCount((currentCount) => currentCount + currentPage.length)
        }

        if (currentPage.length < EXPORT_PAGE_SIZE) {
          break
        }

        beforeTx = currentPage[currentPage.length - 1]?.id
      }

      downloadCsvFile(
        buildBillingHistoryCsv(allItems),
        buildBillingHistoryFilename(selectedProjectName, projectId)
      )

      toast.success("Billing history exported")
    } catch (error) {
      toast.error("Failed to export billing history", {
        description: getErrorMessage(error),
      })
    } finally {
      if (isMountedRef.current) {
        setIsExporting(false)
      }
    }
  }, [isExporting, projectId, selectedProjectName])

  return {
    exportedCount,
    exportFullHistory,
    isExporting,
  }
}

function buildBillingHistoryCsv(items: DTOBillingTransaction[]) {
  const header = serializeCsvRow([...CSV_HEADERS])
  const rows = items.map((item) =>
    serializeCsvRow(formatBillingHistoryCsvRow(item))
  )

  return [header, ...rows].join("\n")
}

function formatBillingHistoryCsvRow(item: DTOBillingTransaction) {
  const { reason, ...metadata } = item.info as Record<string, unknown>
  const signedAmountPrefix =
    item.type === DTOBillingTransactionTypeEnum.DTOCharge ? "-" : "+"

  return [
    item.id,
    new Date(item.created_at).toISOString(),
    item.type,
    typeof reason === "string" ? reason : "",
    item.description,
    `${signedAmountPrefix}${formatAtomicAmount(
      item.amount,
      item.currency === DTOCryptoCurrency.DTO_USDT ? 6 : 9
    )}`,
    formatBillingCurrency(item.currency),
    Object.keys(metadata).length ? JSON.stringify(metadata) : "",
  ]
}

function formatBillingCurrency(currency: DTOCryptoCurrency) {
  return currency === DTOCryptoCurrency.DTO_TON ? "GRAM" : currency
}

function buildBillingHistoryFilename(projectName: string, projectId: number) {
  const timestamp = new Date().toISOString().replace(/:/g, "-")
  const sanitizedProjectName = projectName
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase()

  return `ton-console-billing-history-${sanitizedProjectName}-${projectId}-${timestamp}.csv`
}

function serializeCsvRow(row: string[]) {
  return row.map(escapeCsvValue).join(",")
}

function escapeCsvValue(value: string) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`
}

function downloadCsvFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function formatAtomicAmount(value: string, decimals: number) {
  const amount = BigInt(value || "0")
  const scale = 10n ** BigInt(decimals)
  const whole = amount / scale
  const fraction = amount % scale

  if (fraction === 0n) {
    return whole.toString()
  }

  return `${whole}.${fraction.toString().padStart(decimals, "0").replace(/0+$/, "")}`
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const payload = (error as { error?: { error?: string } }).error
    if (payload?.error) {
      return payload.error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Try again later."
}
