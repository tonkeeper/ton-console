import { normalizeApiBaseUrl } from "./base-url"
import { apiFetch } from "./fetch"
import { Api } from "./api.generated"

export const api = new Api({
  baseUrl: normalizeApiBaseUrl(import.meta.env.VITE_BASE_URL),
  customFetch: apiFetch,
  baseApiParams: {
    credentials: "include",
  },
})
