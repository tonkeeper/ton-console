import { GenerateApiParams, generateApi } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve(process.cwd(), './src/shared/api');
const TARGET_FILE = path.join(OUTPUT_DIR, 'rt.tonapi.generated.ts');

const generateApiParams: GenerateApiParams = {
    name: 'rt.tonapi.generated.ts',
    output: OUTPUT_DIR,
    url: 'https://raw.githubusercontent.com/tonkeeper/opentonapi/refs/heads/master/api/rt.yml',
    typePrefix: 'RT',
    enumKeyPrefix: 'RT',
    extractEnums: true,
    generateUnionEnums: false,
    httpClientType: 'axios',
    templates: undefined
};

/**
 * Post-process: add project_id and network to every query type in API methods.
 *
 * The public rt.yml spec doesn't include project_id / network because they are
 * internal params injected by the ton-console backend proxy.
 * We patch every `query?: { ... }` block inside the Api class methods so that
 * the generated client matches what our proxy actually expects.
 */
function patchQueryParams(source: string): string {
    const CUSTOM_PARAMS = `        project_id: string;\n        network?: 'mainnet' | 'testnet';`;

    // Match query type blocks: `query?: {` or `query: {` followed by content and closing `}`
    // We insert our custom params right before the closing `}` of each query block
    return source.replace(
        /(query\??: \{[^}]*)(})/g,
        `$1${CUSTOM_PARAMS}\n      $2`
    );
}

async function main() {
    const result = await generateApi(generateApiParams);

    // swagger-typescript-api may output as Api.ts despite the name config;
    // handle both possible filenames
    const generatedAsApi = path.join(OUTPUT_DIR, 'Api.ts');

    if (fs.existsSync(generatedAsApi) && generatedAsApi !== TARGET_FILE) {
        fs.renameSync(generatedAsApi, TARGET_FILE);
    }

    let source = fs.readFileSync(TARGET_FILE, 'utf-8');
    source = patchQueryParams(source);
    fs.writeFileSync(TARGET_FILE, source, 'utf-8');

    console.log('✅ Patched project_id & network into query params');
}

main();
