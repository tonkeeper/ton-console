import { Flex, BoxProps, Spinner, Divider } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { JettonCard, JettonStore } from 'src/features';
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

    const jettonStore = useLocalObservable(() => new JettonStore());

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
    }, [jettonStore]);

    const jettonInfo = jettonStore.jettonInfo$.value;
    const jettonInfoLoading = jettonStore.jettonInfo$.isLoading;

    if (jettonInfo === null && jettonInfoLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Jetton</H4>
                <TonConnectButton />
            </Flex>
            {jettonInfo === null ? (
                <Overlay display="flex" justifyContent="center" alignItems="center">
                    <H4>Jetton not found</H4>
                </Overlay>
            ) : (
                <>
                    <JettonCard data={jettonInfo} jettonStore={jettonStore} />
                    <Divider mt={6} />

                    <JettonWallet
                        connectedWalletAddress={connectedWalletAddress}
                        jettonInfo={jettonInfo}
                        jettonStore={jettonStore}
                    />
                </>
            )}
        </Overlay>
    );
};

export default observer(JettonViewPage);
