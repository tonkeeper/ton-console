import type {
  MessageAppFormValues,
  MessageAppPayload,
  MessagePushFormValues,
  MessagePushPayload,
} from "./message-types"

export const MESSAGE_VERIFICATION_FILE = "tc-verify.json"
const TONCONNECT_MANIFEST_FILE = "tonconnect-manifest.json"

export function getMessageAppFormDefaultValues(): MessageAppFormValues {
  return {
    manifestUrl: "",
  }
}

export async function valuesToMessageAppPayload(
  values: MessageAppFormValues
): Promise<MessageAppPayload> {
  return fetchMessageAppPayloadFromManifestUrl(values.manifestUrl)
}

export function validateMessageAppForm(values: MessageAppFormValues) {
  const errors: Partial<Record<keyof MessageAppFormValues, string>> = {}
  const manifestUrl = values.manifestUrl.trim()

  if (!manifestUrl) {
    errors.manifestUrl = "Manifest or app URL is required."
  } else if (!isValidHttpUrl(manifestUrl)) {
    errors.manifestUrl = "Enter an http or https URL."
  }

  return errors
}

export async function fetchMessageAppPayloadFromManifestUrl(
  value: string
): Promise<MessageAppPayload> {
  const manifestUrl = getTonConnectManifestUrl(value)
  const response = await fetch(
    `https://c.tonapi.io/json?url=${encodeBase64Url(manifestUrl)}`
  )

  if (!response.ok) {
    throw new Error("Cannot fetch TonConnect manifest.")
  }

  const manifest = (await response.json()) as {
    name?: unknown
    url?: unknown
    iconUrl?: unknown
  }

  if (typeof manifest.name !== "string" || !manifest.name.trim()) {
    throw new Error("Manifest does not contain an app name.")
  }

  if (typeof manifest.url !== "string" || !isValidHttpUrl(manifest.url)) {
    throw new Error("Manifest does not contain a valid app URL.")
  }

  return {
    name: manifest.name.trim(),
    url: manifest.url.trim(),
    ...(typeof manifest.iconUrl === "string" && manifest.iconUrl.trim()
      ? { image: manifest.iconUrl.trim() }
      : {}),
  }
}

function getTonConnectManifestUrl(value: string) {
  const url = new URL(value.trim())

  if (url.pathname.endsWith(`/${TONCONNECT_MANIFEST_FILE}`)) {
    return url.toString()
  }

  url.pathname = `${url.pathname.replace(/\/$/, "")}/${TONCONNECT_MANIFEST_FILE}`
  return url.toString()
}

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

export function getMessagePushFormDefaultValues(): MessagePushFormValues {
  return {
    title: "",
    message: "",
    link: "",
    addresses: "",
  }
}

export function valuesToMessagePushPayload(
  values: MessagePushFormValues
): MessagePushPayload {
  const addresses = getMessagePushAddresses(values.addresses)

  return {
    ...(values.title.trim() ? { title: values.title.trim() } : {}),
    message: values.message.trim(),
    ...(values.link.trim() ? { link: values.link.trim() } : {}),
    ...(addresses.length === 1 ? { address: addresses[0] } : {}),
    ...(addresses.length > 1 ? { addresses } : {}),
  }
}

export function validateMessagePushForm(values: MessagePushFormValues) {
  const errors: Partial<Record<keyof MessagePushFormValues, string>> = {}
  const title = values.title.trim()
  const message = values.message.trim()
  const link = values.link.trim()
  const addresses = getMessagePushAddresses(values.addresses)

  if (title.length > 80) {
    errors.title = "Title must be 80 characters or fewer."
  }

  if (!message) {
    errors.message = "Message is required."
  } else if (message.length > 300) {
    errors.message = "Message must be 300 characters or fewer."
  }

  if (link && !isValidHttpUrl(link)) {
    errors.link = "Enter an http or https URL."
  }

  if (addresses.some((address) => /\s/.test(address))) {
    errors.addresses = "Separate wallet addresses with commas or new lines."
  }

  return errors
}

export function getMessagePushAddresses(value: string) {
  return value
    .split(/[\n,]/)
    .map((address) => address.trim())
    .filter(Boolean)
}

export function getMessageVerificationPayloadBody(payload: string) {
  return JSON.stringify({ payload }, null, 2)
}

export function getMessageVerificationUrl(appUrl: string) {
  const trimmedUrl = appUrl.trim()

  if (!trimmedUrl) {
    return ""
  }

  try {
    const url = new URL(trimmedUrl)
    url.pathname = joinUrlPath(url.pathname, MESSAGE_VERIFICATION_FILE)
    url.search = ""
    url.hash = ""
    return url.toString()
  } catch {
    return ""
  }
}

function joinUrlPath(pathname: string, fileName: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`
  return `${path}${fileName}`.replace(/\/{2,}/g, "/")
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}
