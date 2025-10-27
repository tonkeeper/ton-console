import { TonAddress } from 'src/shared';

class Explorer {
    constructor(private readonly baseUrl: string) {}

    public accountLink(userFriendlyAddress: string | TonAddress): string {
        if (userFriendlyAddress instanceof TonAddress) {
            userFriendlyAddress = userFriendlyAddress.userFriendly;
        }

        return `${this.baseUrl}/${userFriendlyAddress}`;
    }

    public transactionLink(hash: string): string {
        return `${this.baseUrl}/transaction/${hash}`;
    }
}

export const testnetExplorer = new Explorer('https://testnet.tonviewer.com');

export const explorer = import.meta.env.VITE_TESTNET ? testnetExplorer : new Explorer('https://tonviewer.com');

