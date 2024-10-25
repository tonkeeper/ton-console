export enum SERVICE {
    TONAPI = 'tonapi',
    TONKEEPER_MESSAGES = 'tonkeeper-messages',
    INVOICES = 'invoices',
    ANALYTICS = 'analytics',
    NFT = 'nft',
    JETTON = 'jetton',
    FAUCET = 'faucet',
    DASHBOARD = 'dashboard'
}

export const SERVICE_NAMES: Record<SERVICE, string> = {
    [SERVICE.TONAPI]: 'TonApi',
    [SERVICE.TONKEEPER_MESSAGES]: 'Tonkeeper Messages',
    [SERVICE.INVOICES]: 'Invoices',
    [SERVICE.ANALYTICS]: 'Analytics',
    [SERVICE.NFT]: 'NFT',
    [SERVICE.JETTON]: 'Jetton',
    [SERVICE.FAUCET]: 'Faucet',
    [SERVICE.DASHBOARD]: 'Dashboard'
} as const;
