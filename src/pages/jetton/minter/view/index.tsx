import { Flex, BoxProps, Spinner, Divider } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { JettonCard, JettonStore } from 'src/features';
import { isValidAddress } from 'src/features/jetton/lib/utils';
import JettonWallet from 'src/features/jetton/ui/minter/JettonWallet';

import { H4, Overlay, useSearchParams } from 'src/shared';

const JettonViewPage: FC<BoxProps> = () => {
    const { searchParams } = useSearchParams();
    const jettonAddressStr = searchParams.get('address');

    const jettonStore = useLocalObservable(() => new JettonStore());
    const userAddressStr = useTonAddress();

    useEffect(() => {
        const userAddress = isValidAddress(userAddressStr) ? Address.parse(userAddressStr) : null;
        const jettonAddress = Address.parse(jettonAddressStr ?? '');

        jettonStore.setJettonMasterAddress(jettonAddress, userAddress);
    }, [userAddressStr, jettonAddressStr, jettonStore]);

    if (jettonStore.jettonData$.value === null && jettonStore.jettonData$.isLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    const wallet = jettonStore.wallet;
    const jettonData = jettonStore.jettonData$;

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Jetton</H4>
                <TonConnectButton />
            </Flex>
            {jettonData.value === null ? (
                <Overlay display="flex" justifyContent="center" alignItems="center">
                    <H4>Jetton not found</H4>
                </Overlay>
            ) : (
                <>
                    <JettonCard data={jettonData.value.jettonInfo} />
                    <Divider mt={6} />
                    <JettonWallet
                        onChangeWallet={jettonStore.fetchJettonDetails}
                        jettonWallet={wallet}
                        jettonMetadata={jettonData.value.jettonInfo.metadata}
                    />
                </>
            )}
        </Overlay>
    );
};

export default observer(JettonViewPage);
