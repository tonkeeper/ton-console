import { HttpClient, Api } from "tonapi-sdk-js"

const authToken = import.meta.env.VITE_TONAPI_TOKEN
const baseUrl =
  import.meta.env.VITE_TESTNET === "true"
    ? "https://testnet.tonapi.io"
    : "https://tonapi.io"

const httpClient = new HttpClient({
  baseUrl,
  baseApiParams: {
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      "Content-type": "application/json",
    },
  },
})

export const client = new Api(httpClient)
