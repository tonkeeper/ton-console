import { Address } from '@ton/core';
import { isAddressValid } from './address-validator';

describe('isAddressValid', () => {
    const address = Address.parse(
        '0:d8cd999fb2b1b384e6ca254c3883375e23111a8b78c015b886286c31bf11e29d'
    );
    const rawAddress = address.toRawString();
    const bounceableAddress = address.toString({ bounceable: true });
    const nonBounceableAddress = address.toString({ bounceable: false });
    const testnetBounceableAddress = address.toString({ bounceable: true, testOnly: true });
    const testnetNonBounceableAddress = address.toString({ bounceable: false, testOnly: true });
    const invalidAddress = 'invalid-address';

    const optionsSet = [
        { acceptTestnet: true, acceptRaw: true },
        { acceptTestnet: false, acceptRaw: true },
        { acceptTestnet: true, acceptRaw: false },
        { acceptTestnet: false, acceptRaw: false },
        {},
        { acceptTestnet: true },
        { acceptRaw: true },
        { acceptTestnet: true, acceptRaw: true }
    ];

    const addresses = [
        { type: 'Bounceable', value: bounceableAddress },
        { type: 'Non-Bounceable', value: nonBounceableAddress },
        { type: 'Raw', value: rawAddress, raw: true },
        { type: 'Testnet Bounceable', value: testnetBounceableAddress, testnet: true },
        { type: 'Testnet Non-Bounceable', value: testnetNonBounceableAddress, testnet: true },
        { type: 'Invalid', value: invalidAddress, invalid: true }
    ];

    addresses.forEach(({ type, value, invalid, raw, testnet }) => {
        describe(`${type} Address`, () => {
            optionsSet.forEach((options, index) => {
                const optionsLabel = JSON.stringify(options);
                it(`should handle with options set ${index}: ${optionsLabel}`, () => {
                    const result = isAddressValid(value, options);
                    if (invalid) {
                        expect(result).toBe(false);
                    } else if (testnet && options.acceptTestnet !== true) {
                        expect(result).toBe(false); // Testnet addresses should fail unless `acceptTestnet: true`
                    } else if (raw && options.acceptRaw !== true) {
                        expect(result).toBe(false); // Raw address should fail unless `acceptRaw: true`
                    } else {
                        expect(result).toBe(true); // Valid case
                    }
                });
            });
        });
    });
});
