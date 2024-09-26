import { Address } from '@ton/core';

export function isAddressValid(
    address: string,
    { acceptTestnet = false, acceptRaw = false } = {}
): boolean {
    if (!Address.isRaw(address) && !Address.isFriendly(address)) {
        return false;
    }

    if (Address.isRaw(address) && !acceptRaw) {
        return false;
    }

    if (Address.isFriendly(address) && !acceptTestnet) {
        const { isTestOnly } = Address.parseFriendly(address);
        if (isTestOnly) {
            return false;
        }
    }

    return true;
}
