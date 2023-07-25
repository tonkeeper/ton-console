class Explorer {
    constructor(private readonly baseUrl: string) {}

    public accountLink(userFriendlyAddress: string): string {
        return `${this.baseUrl}/account/${userFriendlyAddress}`;
    }

    public transactionLink(hash: string): string {
        return `${this.baseUrl}/transaction/${hash}`;
    }
}

export const explorer = new Explorer('https://tonviewer.com');

export const testnetExplorer = new Explorer('https://testnet.tonviewer.com');
