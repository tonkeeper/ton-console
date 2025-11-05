import { Address } from '@ton/core';

export function toUserFriendlyAddress(rawAddress: string): string {
    return Address.parse(rawAddress).toString();
}

export function sliceAddress(
    address: string | Address,
    options?: { headLength?: number; tailLength?: number; bounceable?: boolean }
): string {
    const headLength = options?.headLength || 6;
    const tailLength = options?.headLength || 4;

    if (address instanceof Address) {
        address = address.toString({ bounceable: options?.bounceable });
    }
    return `${address.slice(0, headLength)}…${address.slice(-tailLength)}`;
}
