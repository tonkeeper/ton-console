import { joinApiBaseUrl } from "./base-url"
import { apiFetch } from "./fetch"
import { Api } from "./webhooks.generated"

export const webhooksApi = new Api({
  baseUrl: joinApiBaseUrl(import.meta.env.VITE_BASE_URL, "/streaming-api"),
  customFetch: apiFetch,
  baseApiParams: {
    credentials: "include",
  },
})
