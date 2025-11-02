export function createTransferLink(
    address: string,
    options: {
        amount: string;
        text: string;
        jetton: string;
    }
): string {
    const baseUrl = 'https://app.tonkeeper.com/transfer';
    const link = new URL(address ? `${baseUrl}/${address}` : baseUrl);

    link.searchParams.append('jetton', options.jetton);
    link.searchParams.append('amount', options.amount);
    link.searchParams.append('text', options.text);

    return link.toString();
}
