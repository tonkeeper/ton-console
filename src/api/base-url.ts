export function normalizeApiBaseUrl(value: string | undefined) {
  if (!value || value === "/") {
    return ""
  }

  return value.endsWith("/") ? value.slice(0, -1) : value
}

export function joinApiBaseUrl(baseUrl: string, path: string) {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseUrl)
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}
