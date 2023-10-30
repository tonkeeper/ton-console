import { Address } from 'ton-core';

export class TonAddress extends Address {
    static parse(source: string): TonAddress {
        const parsed = super.parse(source);
        return new TonAddress(parsed.workChain, parsed.hash);
    }

    public readonly userFriendly: string;

    constructor(...args: ConstructorParameters<typeof Address>) {
        super(...args);

        this.userFriendly = this.toString({ urlSafe: true, bounceable: false });
    }
}
