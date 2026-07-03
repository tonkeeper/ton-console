import { joinApiBaseUrl, normalizeApiBaseUrl } from "./base-url"
import { apiFetch } from "./fetch"
import { Api } from "./airdrop.generated"

const airdropBaseUrl = import.meta.env.VITE_AIRDROP_BASE_URL
  ? normalizeApiBaseUrl(import.meta.env.VITE_AIRDROP_BASE_URL)
  : joinApiBaseUrl(import.meta.env.VITE_BASE_URL ?? "", "/airdrop-api")

const airdropApiConfig = {
  baseUrl: airdropBaseUrl,
  customFetch: apiFetch,
  baseApiParams: {
    credentials: "include" as const,
  },
}

export const airdropApi = new Api(airdropApiConfig)
