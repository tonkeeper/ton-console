import { Address } from '@ton/core';

export function toUserFriendlyAddress(
    rawAddress: string,
    options?: { bounceable?: boolean; testOnly?: boolean }
): string {
    return Address.parse(rawAddress).toString({
        bounceable: options?.bounceable,
        testOnly: options?.testOnly
    });
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
