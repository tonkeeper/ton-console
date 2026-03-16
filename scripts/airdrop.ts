import { GenerateApiParams, generateApi } from 'swagger-typescript-api';
import path from 'path';

const generateApiParams: GenerateApiParams = {
    fileName: 'airdrop.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    input: path.resolve(process.cwd(), './scripts/airdrops.yaml'),
    apiClassName: 'ApiV1',
    typePrefix: 'AD',
    enumKeyPrefix: 'AD',
    extractEnums: true,
    generateUnionEnums: false,
    httpClientType: 'axios',
    templates: undefined
};

generateApi(generateApiParams);
