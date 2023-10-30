import { Address } from 'ton-core';
import { TonAddress } from 'src/shared';

export function toUserFriendlyAddress(rawAddress: string): string {
    return Address.parse(rawAddress).toString();
}

export function sliceAddress(
    address: string | TonAddress,
    options?: { headLength?: number; tailLength?: number }
): string {
    const headLength = options?.headLength || 6;
    const tailLength = options?.headLength || 4;
    if (address instanceof TonAddress) {
        address = address.userFriendly;
    }
    return `${address.slice(0, headLength)}…${address.slice(-tailLength)}`;
}
