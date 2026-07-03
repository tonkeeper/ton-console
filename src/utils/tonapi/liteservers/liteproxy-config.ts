import type { DTOLiteproxyKey } from "@/api/api.generated"

type LiteproxyConfigServer = {
  server: string
  public_key: string
  rps: number
}

export function getLiteproxyConfig(keys: DTOLiteproxyKey[]) {
  const liteservers = keys.map((key) => ({
    ip: ipToSignedInt32(key.server.split(":")[0] ?? ""),
    port: Number.parseInt(key.server.split(":")[1] ?? "", 10),
    id: {
      "@type": "pub.ed25519",
      key: key.public_key,
    },
  }))

  return JSON.stringify(
    {
      "@type": "config.global",
      liteservers,
    },
    null,
    2
  )
}

export function getLiteproxyKeysText(keys: DTOLiteproxyKey[]) {
  const config: LiteproxyConfigServer[] = keys.map((key) => ({
    server: key.server,
    public_key: key.public_key,
    rps: key.rps,
  }))

  return JSON.stringify(config, null, 2)
}

function ipToSignedInt32(ip: string) {
  const parts = ip.split(".").map(Number)
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return ip
  }

  const unsigned =
    ((parts[0] << 24) >>> 0) +
    ((parts[1] << 16) >>> 0) +
    ((parts[2] << 8) >>> 0) +
    parts[3]

  return unsigned | 0
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
