import type { DTOTokenCapability } from "@/api/api.generated"

export type ApiKey = {
  id: number
  name: string
  token: string
  createdAt: Date
  limitRps?: number
  origins: string[]
  capabilities: DTOTokenCapability[]
}

export type ApiKeyFormValues = {
  name: string
  mode: "unlimited" | "ip"
  limitRps: string
  origins: string
  cocoon: boolean
}

export type ApiKeyPayload = {
  name: string
  limitRps?: number
  origins?: string[]
  capabilities?: DTOTokenCapability[]
}
