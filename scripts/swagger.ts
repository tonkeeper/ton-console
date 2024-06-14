import { GenerateApiParams, generateApi } from 'swagger-typescript-api'
import path from 'path';

const generateApiParams: GenerateApiParams = {
    name: 'api.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    input: path.resolve(process.cwd(), './scripts/swagger.yaml'),
    typePrefix: 'DTO',
    enumKeyPrefix: 'DTO',
    extractEnums: true,
    generateUnionEnums: false,
    httpClientType: 'axios',
    templates: undefined
};

generateApi(generateApiParams);
