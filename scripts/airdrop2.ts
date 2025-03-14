import { GenerateApiParams, generateApi } from 'swagger-typescript-api';
import path from 'path';

const generateApiParams: GenerateApiParams = {
    name: 'airdrop2.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    input: path.resolve(process.cwd(), './scripts/airdrop2.yaml'),
    apiClassName: 'Api',
    typePrefix: 'AD',
    enumKeyPrefix: 'AD',
    extractEnums: true,
    generateUnionEnums: false,
    httpClientType: 'axios',
    templates: undefined
};

generateApi(generateApiParams);
