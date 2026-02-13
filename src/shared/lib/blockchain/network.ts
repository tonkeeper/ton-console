import { DTOChain } from 'src/shared/api';

export enum Network {
    MAINNET = 'mainnet',
    TESTNET = 'testnet'
}

export const DTOChainNetworkMap: Record<DTOChain, Network> = {
    [DTOChain.MAINNET]: Network.MAINNET,
    [DTOChain.TESTNET]: Network.TESTNET
};
