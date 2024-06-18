import { DTOChain } from 'src/shared/api';

export enum Network {
    MAINNET = 'mainnet',
    TESTNET = 'testnet'
}

export const DTOChainNetworkMap: Record<DTOChain, Network> = {
    [DTOChain.DTOMainnet]: Network.MAINNET,
    [DTOChain.DTOTestnet]: Network.TESTNET
};
