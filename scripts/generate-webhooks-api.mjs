import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { generateApi } from "swagger-typescript-api"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const outputDir = path.resolve(rootDir, "src/api")
const targetFile = path.resolve(outputDir, "webhooks.generated.ts")

function patchQueryParams(source) {
  const customParams = `        project_id: string;\n        network?: "mainnet" | "testnet";`

  return source.replace(
    /(query\??: \{[^}]*)(})/g,
    `$1${customParams}\n      $2`
  )
}

await generateApi({
  url: "https://raw.githubusercontent.com/tonkeeper/opentonapi/refs/heads/master/api/rt.yml",
  output: outputDir,
  fileName: "webhooks.generated.ts",
  typePrefix: "RT",
  enumKeyPrefix: "RT",
  extractEnums: true,
  generateUnionEnums: false,
  httpClientType: "fetch",
  cleanOutput: false,
})

let source = fs.readFileSync(targetFile, "utf-8")
source = patchQueryParams(source)
fs.writeFileSync(targetFile, source, "utf-8")

console.log("Patched project_id and network into webhook query params")
