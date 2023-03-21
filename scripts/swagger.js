var generateApi = require('swagger-typescript-api').generateApi;
var path = require('path');

generateApi({
    name: 'api.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    input: path.resolve(process.cwd(), './scripts/swagger.yaml'),
    typePrefix: 'DTO',
    enumKeyPrefix: 'DTO',
    httpClientType: 'axios',
    templates: undefined
});
