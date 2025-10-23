/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USDT_JETTON_ADDRESS: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_BASE_PROXY_URL: string;
    readonly VITE_TONAPI_TOKEN: string;
    readonly VITE_TESTNET: string;
    readonly VITE_AVAILABLE_DELETE_PROJECT: string;
    readonly VITE_DEPLOY_JETTON_QUERY_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
