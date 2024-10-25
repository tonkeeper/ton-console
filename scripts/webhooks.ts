import { GenerateApiParams, generateApi } from 'swagger-typescript-api'
import path from 'path';

const generateApiParams: GenerateApiParams = {
    name: 'rt.tonapi.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    url: 'https://raw.githubusercontent.com/tonkeeper/opentonapi/refs/heads/master/api/rt.yml',
    typePrefix: 'RT',
    enumKeyPrefix: 'RT',
    extractEnums: true,
    generateUnionEnums: false,
    httpClientType: 'axios',
    templates: undefined
};

generateApi(generateApiParams);
