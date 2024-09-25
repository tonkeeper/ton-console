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
