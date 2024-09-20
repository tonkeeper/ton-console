import { Address, beginCell, toNano } from '@ton/ton';
import { JettonDeployParams, JETTON_DEPLOY_GAS } from './deploy-controller';
import { initData, JETTON_MINTER_CODE, mintBody } from './jetton-minter';
import { Api } from '@ton-api/client';

export async function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function zeroAddress(): Address {
    return beginCell()
        .storeUint(2, 2)
        .storeUint(0, 1)
        .storeUint(0, 8)
        .storeUint(0, 256)
        .endCell()
        .beginParse()
        .loadAddress();
}

// async function getSeqno(address: Address, tc: TonClient) {
//     return makeGetCall(address, 'seqno', null, tc).then(reader => reader.readBigNumber());
// }

// export async function waitForSeqno(address: string) {
//     const tc = await getClient();
//     const ownerAddress = Address.parse(address);
//     const seqnoBefore = await getSeqno(ownerAddress, tc);

//     return async () => {
//         for (let attempt = 0; attempt < 25; attempt++) {
//             await sleep(3000);
//             const seqnoAfter = await getSeqno(ownerAddress, tc);
//             if (seqnoAfter > seqnoBefore) return;
//         }
//         throw new Error('Timeout');
//     };
// }

export async function waitForContractDeploy(address: Address, tonApiClient: Api<unknown>) {
    let isDeployed = false;
    let maxTries = 25;
    while (!isDeployed && maxTries > 0) {
        maxTries--;
        isDeployed = await tonApiClient.accounts
            .getAccount(address)
            .then(v => v.status === 'active');
        if (isDeployed) return;
        await sleep(3000);
    }
    throw new Error('Timeout');
}

export const createDeployParams = async (params: JettonDeployParams, offchainUri?: string) => {
    const deployer = params.owner;
    const queryId = BigInt(import.meta.env.VITE_DEPLOY_JETTON_QUERY_ID ?? 0);
    const data = await initData(deployer, params.onchainMetaData, offchainUri);
    const message = mintBody(deployer, params.amountToMint, toNano(0.2), queryId);

    return {
        data,
        message,
        deployer,
        code: JETTON_MINTER_CODE,
        value: JETTON_DEPLOY_GAS
    };
};

export const isValidAddress = (address: string) => {
    try {
        const result = Address.parse(address);
        if (result && result.toString() === zeroAddress().toString()) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * This function is based on the `toNano` function from the TON Core project.
 * The original function can be found at the following link:
 * https://github.com/ton-org/ton-core/blob/3a68441b615f5fa817106c7f4d9586656a9f81b4/src/utils/convert.ts#L9
 *
 * Unlike `toNano`, this function is designed to convert numeric values with arbitrary precision
 */
export function toDecimals(src: number | string, decimals: number | string): bigint {
    const bigIntDecimals = 10n ** BigInt(decimals);

    if (typeof src === 'bigint') {
        return src * bigIntDecimals;
    } else {
        if (typeof src === 'number') {
            if (!Number.isFinite(src)) {
                throw Error('Invalid number');
            }

            if (Math.log10(src) <= 6) {
                src = src.toLocaleString('en', { minimumFractionDigits: 9, useGrouping: false });
            } else if (src - Math.trunc(src) === 0) {
                src = src.toLocaleString('en', { maximumFractionDigits: 0, useGrouping: false });
            } else {
                throw Error('Not enough precision for a number value. Use string value instead');
            }
        }

        // Check sign
        let neg = false;
        while (src.startsWith('-')) {
            neg = !neg;
            src = src.slice(1);
        }

        // Split string
        if (src === '.') {
            throw Error('Invalid number');
        }
        const parts = src.split('.');
        if (parts.length > 2) {
            throw Error('Invalid number');
        }

        // Prepare parts
        let whole = parts[0];
        let frac = parts[1];
        if (!whole) {
            whole = '0';
        }
        if (!frac) {
            frac = '0';
        }
        if (frac.length > 9) {
            throw Error('Invalid number');
        }
        while (frac.length < 9) {
            frac += '0';
        }

        // Convert
        let r = BigInt(whole) * bigIntDecimals + BigInt(frac);
        if (neg) {
            r = -r;
        }
        return r;
    }
}

export function fromDecimals(num: bigint | number | string, decimals: number | string): string {
    const dec = Number(decimals);
    const strNum = BigInt(num)
        .toString()
        .padStart(dec + 1, '0');

    const intPart = strNum.slice(0, -dec);
    const fracPart = strNum.slice(-dec).replace(/0+$/, '');

    return [intPart, fracPart].filter(Boolean).join('.');
}
