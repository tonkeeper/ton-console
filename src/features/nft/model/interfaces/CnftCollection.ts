import { Address } from 'ton-core';

export interface CnftCollection {
    account: Address;
    /** @example "name" */
    name: string;
    description?: string;
    image?: string;
    nft_count: number;
    minted_count: number;
    paid_indexing_count: number;
}
