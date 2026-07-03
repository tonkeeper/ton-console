export const apiFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers)
  const body = init?.body

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(input, {
    ...init,
    headers,
  })
}
