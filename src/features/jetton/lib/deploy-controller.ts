import { ContractDeployer } from './contract-deployer';

import { createDeployParams, waitForContractDeploy } from './utils';
// import { zeroAddress } from './utils';
// import {
//     buildJettonOnchainMetadata,
//     burn,
//     mintBody,
//     readJettonMetadata,
//     transfer,
//     updateMetadataBody,
//     changeAdminBody,
//     JettonMetaDataKeys
// } from './jetton-minter';

import { JettonInfo } from '@ton-api/client';
import { Address, beginCell, toNano } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui-react';

import { tonapiMainnet } from 'src/shared';

export const JETTON_DEPLOY_GAS = toNano(0.25);

export enum JettonDeployState {
    NOT_STARTED,
    BALANCE_CHECK,
    UPLOAD_IMAGE,
    UPLOAD_METADATA,
    AWAITING_MINTER_DEPLOY,
    AWAITING_JWALLET_DEPLOY,
    VERIFY_MINT,
    ALREADY_DEPLOYED,
    DONE
}

export interface JettonDeployParams {
    onchainMetaData?: {
        name: string;
        symbol: string;
        description?: string;
        image?: string;
        decimals?: string;
    };
    offchainUri?: string;
    owner: Address;
    amountToMint: bigint;
}

export interface JettonWallet {
    balance: bigint;
    jWalletAddress: Address;
    jettonMasterAddress: Address;
}

export interface JettonData {
    jettonInfo: JettonInfo;
    jettonWallet: JettonWallet | null;
}

export class JettonDeployController {
    async createJetton(params: JettonDeployParams, tonConnection: TonConnectUI): Promise<Address> {
        const contractDeployer = new ContractDeployer();
        const balance = await tonapiMainnet.accounts.getAccount(params.owner).then(v => v.balance);

        if (balance < JETTON_DEPLOY_GAS) throw new Error('Not enough balance in deployer wallet');

        const deployParams = await createDeployParams(params, params.offchainUri);
        const contractAddr = contractDeployer.addressForContract(deployParams);

        const isDeployed = await tonapiMainnet.accounts
            .getAccount(contractAddr)
            .then(v => v.status === 'active');

        if (!isDeployed) {
            await contractDeployer.deployContract(deployParams, tonConnection);
            await waitForContractDeploy(contractAddr, tonapiMainnet);
        }

        const ownerAddress = beginCell()
            .storeAddress(params.owner)
            .endCell()
            .toBoc()
            .toString('hex');

        const ownerJWalletAddr = await tonapiMainnet.blockchain
            .execGetMethodForBlockchainAccount(contractAddr, 'get_wallet_address', {
                args: [ownerAddress]
            })
            .then(v => Address.parse(v.decoded.jetton_wallet_address));

        await waitForContractDeploy(ownerJWalletAddr, tonapiMainnet);

        return contractAddr;
    }

    // async transfer(
    //     tonConnection: TonConnectUI,
    //     amount: bigint,
    //     toAddress: string,
    //     fromAddress: string,
    //     ownerJettonWallet: string
    // ) {
    //     const waiter = await waitForSeqno(fromAddress);

    //     const tx: SendTransactionRequest = {
    //         validUntil: Date.now() + 5 * 60 * 1000,
    //         messages: [
    //             {
    //                 address: ownerJettonWallet,
    //                 amount: toNano(0.05).toString(),
    //                 stateInit: undefined,
    //                 payload: transfer(Address.parse(toAddress), Address.parse(fromAddress), amount)
    //                     .toBoc()
    //                     .toString('base64')
    //             }
    //         ]
    //     };

    //     await tonConnection.sendTransaction(tx);

    //     await waiter();
    // }
}

const jettonDeployController = new JettonDeployController();
export { jettonDeployController };
