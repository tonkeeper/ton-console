export function shortAddress(address: string, options?: { maxLength: number }): string {
    const maxLength = options?.maxLength || 13;
    return (
        address.slice(0, Math.ceil((maxLength - 1) / 2)) +
        '…' +
        address.slice(-Math.floor((maxLength - 1) / 2))
    );
}
