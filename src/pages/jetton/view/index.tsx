import { Flex, BoxProps, Spinner, Divider } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo } from 'react';
import { JettonCard, jettonStore } from 'src/features';
import { isValidAddress } from 'src/features/jetton/lib/utils';
import JettonWallet from 'src/features/jetton/ui/minter/JettonWallet';

import { H4, Overlay, useSearchParams } from 'src/shared';

const JettonViewPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const jettonAddressStr = searchParams.get('address');

    const connectedWalletAddressStr = useTonAddress();
    const connectedWalletAddress = useMemo(
        () => (connectedWalletAddressStr ? Address.parse(connectedWalletAddressStr) : null),
        [connectedWalletAddressStr]
    );

    useEffect(() => {
        const jettonAddress =
            jettonAddressStr && isValidAddress(jettonAddressStr)
                ? Address.parse(jettonAddressStr)
                : null;

        jettonStore.setJettonAddress(jettonAddress);
    }, [jettonAddressStr, jettonStore]);

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
                    <JettonCard data={jettonInfo} />
                    <Divider mt={6} />

                    <JettonWallet
                        connectedWalletAddress={connectedWalletAddress}
                        jettonInfo={jettonInfo}
                    />
                </>
            )}
        </Overlay>
    );
};

export default observer(JettonViewPage);
