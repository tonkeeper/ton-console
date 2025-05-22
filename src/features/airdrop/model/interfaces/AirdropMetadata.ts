export interface AirdropMetadata {
    name: string;
    address: string;
    fee: string;
    vesting: { unlockTime?: string; fraction?: number }[] | null;
}
