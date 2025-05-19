import { Flex, BoxProps, Spinner, Divider } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo } from 'react';
import { JettonCard, jettonStore } from 'src/features';
import { isValidAddress } from 'src/features/jetton/lib/utils';
import JettonWallet from 'src/features/jetton/ui/minter/JettonWallet';
import { H4, Overlay } from 'src/shared';
import { useParams } from 'react-router-dom';

const JettonViewPage: FC<BoxProps> = () => {
    const { address } = useParams<{ address: string }>();
    const connectedWalletAddressStr = useTonAddress();
    const connectedWalletAddress = useMemo(
        () => (connectedWalletAddressStr ? Address.parse(connectedWalletAddressStr) : null),
        [connectedWalletAddressStr]
    );

    useEffect(() => {
        const jettonAddress = address && isValidAddress(address) ? Address.parse(address) : null;
        jettonStore.setJettonAddress(jettonAddress);
    }, [address, jettonStore]);

    useEffect(() => {
        jettonStore.setConnectedWalletAddress(connectedWalletAddress);
    }, [connectedWalletAddress, jettonStore]);

    useEffect(() => {
        return () => {
            jettonStore.setJettonAddress(null);
            jettonStore.setConnectedWalletAddress(null);
        };
    }, []);

    const jettonInfo = jettonStore.jettonInfo$.value;
    const jettonInfoLoading = jettonStore.jettonInfo$.isLoading;

    if (jettonInfo === null && jettonInfoLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    if (!jettonInfo) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <H4>Jetton not found</H4>
            </Overlay>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <H4>Jetton</H4>
                <TonConnectButton />
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="row" gap="16px" px="6">
                <Flex direction="column" gap="24px" minW="520px" maxW="520px">
                    <JettonCard data={jettonInfo} />
                </Flex>
                <Flex direction="column" gap="16px">
                    <JettonWallet
                        connectedWalletAddress={connectedWalletAddress}
                        jettonInfo={jettonInfo}
                    />
                </Flex>
            </Flex>
        </Overlay>
    );
};

export default observer(JettonViewPage);
