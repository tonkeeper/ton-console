import { Flex, BoxProps, Spinner, Divider, Text } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { JettonCard, JettonStore } from 'src/features';
import JettonWallet from 'src/features/jetton/ui/minter/JettonWallet';

import { H4, Overlay, useSearchParams } from 'src/shared';

const JettonViewPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const jettonAddressStr = searchParams.get('address');

    const jettonStore = useLocalObservable(() => new JettonStore());
    const userAddressStr = useTonAddress();

    useEffect(() => {
        if (userAddressStr) {
            const userAddress = Address.parse(userAddressStr);
            const jettonAddress = Address.parse(jettonAddressStr ?? '');

            jettonStore.setJettonMasterAddress(jettonAddress, userAddress);
        }
    }, [userAddressStr, jettonAddressStr, jettonStore]);

    if (jettonStore.jettonData$.value === null && jettonStore.jettonData$.isLoading) {
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
            {jettonStore.jettonData$.value === null ? (
                <Overlay display="flex" justifyContent="center" alignItems="center">
                    <H4>Jetton not found</H4>
                </Overlay>
            ) : (
                <>
                    <JettonCard data={jettonStore.jettonData$.value.minter} />
                    <Divider mt={6} />
                    <Text textStyle="label1" py={5}>
                        Connected Jetton wallet
                    </Text>
                    <JettonWallet jettonStore={jettonStore} />
                </>
            )}
        </Overlay>
    );
};

export default observer(JettonViewPage);
