import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { generateApi } from "swagger-typescript-api"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const outputDir = path.resolve(rootDir, "src/api")

function patchProjectIdQueryParams(source) {
  let nextSource = source.replace(
    /(query: \{\n(?:\s+\/\*\*[\s\S]*?\*\/\n)?\s+id: string;\n\s+\})/g,
    (match) =>
      match.replace(
        "\n      }",
        `\n        /** Project ID */\n        project_id?: number | string;\n      }`
      )
  )

  nextSource = nextSource.replace(
    /(newAirdrop: \(\n\s+data: \{[\s\S]*?\n\s+},\n)(\s+params: RequestParams = \{\},)/,
    `$1      query?: { project_id?: number | string },\n$2`
  )
  nextSource = nextSource.replace(
    /(path: `\/v[12]\/airdrop`,\n\s+method: "POST",\n)(\s+body: data,)/,
    `$1        query: query,\n$2`
  )

  nextSource = nextSource.replace(
    /getConfig: \(params: RequestParams = \{\}\) =>\n\s+this\.request<ADConfig, ADError>\(\{/,
    `getConfig: (\n      query?: { project_id?: number | string },\n      params: RequestParams = {},\n    ) =>\n      this.request<ADConfig, ADError>({`
  )
  nextSource = nextSource.replace(
    /(path: `\/v[12]\/config`,\n\s+method: "GET",\n)(\s+format: "json",)/,
    `$1        query: query,\n$2`
  )

  return nextSource
}

await generateApi({
  input: path.resolve(rootDir, "scripts/airdropsV2.yaml"),
  output: outputDir,
  fileName: "airdrop.generated.ts",
  typePrefix: "AD",
  enumKeyPrefix: "AD",
  extractEnums: true,
  generateUnionEnums: false,
  httpClientType: "fetch",
  cleanOutput: false,
})

const targetFile = path.resolve(outputDir, "airdrop.generated.ts")
const source = patchProjectIdQueryParams(fs.readFileSync(targetFile, "utf-8"))
fs.writeFileSync(targetFile, source, "utf-8")

console.log("Generated airdrop API client")
