import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './scripts/swagger.yaml',
  output: 'src/shared/api/console',
  plugins: [
    '@hey-api/typescript',
    '@hey-api/client-fetch',
    {
      name: '@hey-api/sdk',
      asClass: false
    },
    {
      name: '@hey-api/typescript',
      enums: 'typescript',
      definitions: {
        name: 'DTO{{name}}',
        case: 'preserve'
      }
    }
  ]
});
