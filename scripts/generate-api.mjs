import path from "node:path"
import { fileURLToPath } from "node:url"
import { generateApi } from "swagger-typescript-api"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

await generateApi({
  input: path.resolve(rootDir, "scripts/swagger.yaml"),
  output: path.resolve(rootDir, "src/api"),
  fileName: "api.generated.ts",
  typePrefix: "DTO",
  enumKeyPrefix: "DTO",
  extractEnums: true,
  generateUnionEnums: false,
  httpClientType: "fetch",
  cleanOutput: false,
})
