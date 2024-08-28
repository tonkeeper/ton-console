import { Address } from '@ton/core';

export interface JettonMetadata {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    description: string;
}
