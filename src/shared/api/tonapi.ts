export class Tonapi {
    private readonly baseUrl: string;

    constructor(public readonly chain: 'mainnet' | 'testnet' = 'mainnet') {
        this.baseUrl =
            chain === 'mainnet'
                ? import.meta.env.VITE_TONAPI_BASE_URL
                : import.meta.env.VITE_TONAPI_TESTNET_BASE_URL;
    }

    private async sendRequest<T>(path: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TONAPI_TOKEN}`
            }
        });

        return response.json();
    }

    public async getTransactionHashByMessage(msgHash: string): Promise<string> {
        const data = await this.sendRequest<{ hash: string } | { error: unknown }>(
            `blockchain/messages/${msgHash}/transaction`
        );
        if ('error' in data) {
            throw new Error(data.error as string);
        }
        return data.hash;
    }
}

export const TonapiMainnet = new Tonapi('mainnet');
export const TonapiTestnet = new Tonapi('testnet');
