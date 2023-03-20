var generateApi = require('swagger-typescript-api').generateApi;
var path = require('path');

generateApi({
    name: 'ton-console-api.generated.ts',
    output: path.resolve(process.cwd(), './src/shared/api'),
    input: path.resolve(process.cwd(), './scripts/swagger.yaml'),
    typePrefix: 'DTO',
    enumKeyPrefix: 'DTO',
    templates: undefined
});
