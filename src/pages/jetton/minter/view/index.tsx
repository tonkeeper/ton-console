import { Flex, BoxProps, Spinner, Divider } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { FC, useMemo } from 'react';
import { JettonCard } from 'src/features';
import { isValidAddress } from 'src/features/jetton/lib/utils';
import JettonWallet from 'src/features/jetton/ui/minter/JettonWallet';
import { H4, Overlay } from 'src/shared';
import { useParams } from 'react-router-dom';
import { useJettonInfoQuery, useJettonWalletQuery } from 'src/features/jetton/model/queries';

const JettonViewPage: FC<BoxProps> = () => {
    const { address } = useParams<{ address: string }>();
    const connectedWalletAddressStr = useTonAddress();

    const connectedWalletAddress = useMemo(
        () => (connectedWalletAddressStr ? Address.parse(connectedWalletAddressStr) : null),
        [connectedWalletAddressStr]
    );

    const jettonAddress = useMemo(
        () => (address && isValidAddress(address) ? Address.parse(address) : null),
        [address]
    );

    const { data: jettonInfo, isLoading: jettonInfoLoading } = useJettonInfoQuery(jettonAddress);
    const { data: jettonWallet } = useJettonWalletQuery(jettonAddress, connectedWalletAddress);

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
            {jettonInfo === null || jettonInfo === undefined ? (
                <Overlay display="flex" justifyContent="center" alignItems="center">
                    <H4>Jetton not found</H4>
                </Overlay>
            ) : (
                <>
                    <JettonCard
                        data={jettonInfo}
                        jettonAddress={jettonAddress}
                        connectedWalletAddress={connectedWalletAddress}
                    />
                    <Divider mt={6} />

                    <JettonWallet
                        connectedWalletAddress={connectedWalletAddress}
                        jettonInfo={jettonInfo}
                        jettonAddress={jettonAddress}
                        jettonWallet={jettonWallet ?? null}
                    />
                </>
            )}
        </Overlay>
    );
};

export default JettonViewPage;
