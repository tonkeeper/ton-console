import { TonAddress } from 'src/shared';

export function shortAddress(
    address: string | TonAddress,
    options?: { maxLength: number }
): string {
    if (address instanceof TonAddress) {
        address = address.userFriendly;
    }

    const maxLength = options?.maxLength || 13;
    return (
        address.slice(0, Math.ceil((maxLength - 1) / 2)) +
        '…' +
        address.slice(-Math.floor((maxLength - 1) / 2))
    );
}
