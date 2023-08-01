import { Address } from 'ton-core';

export function toUserFriendlyAddress(rawAddress: string): string {
    return Address.parse(rawAddress).toString();
}

export function sliceAddress(
    address: string,
    options?: { headLength?: number; tailLength?: number }
): string {
    const headLength = options?.headLength || 6;
    const tailLength = options?.headLength || 4;
    return `${address.slice(0, headLength)}…${address.slice(-tailLength)}`;
}
