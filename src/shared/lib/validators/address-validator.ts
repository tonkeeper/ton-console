import { Address } from 'ton-core';

export function isAddersValid(address: string): boolean {
    try {
        if (address.includes(':')) return false;
        const a = Address.parseFriendly(address);
        if (a.isTestOnly) {
            return false;
        }
        return [0, -1].includes(a.address.workChain);
    } catch (e) {
        return false;
    }
}
