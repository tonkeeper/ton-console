import { Address } from 'ton-core';

export function isAddressValid(
    address: string,
    options?: { acceptTestnet?: boolean; acceptRaw?: boolean; acceptMasterchain?: boolean }
): boolean {
    try {
        if (address.includes(':') && !options?.acceptRaw) {
            return false;
        }

        let a: Address;
        if (!options?.acceptTestnet) {
            const { address: parsed, isTestOnly } = Address.parseFriendly(address);
            a = parsed;
            if (isTestOnly) {
                return false;
            }
        } else {
            a = Address.parse(address);
        }

        return (options?.acceptMasterchain ? [0, -1] : [0]).includes(a.workChain);
    } catch (e) {
        return false;
    }
}
