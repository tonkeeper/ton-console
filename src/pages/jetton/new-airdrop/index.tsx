import { Address, Cell } from '@ton/core';
import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, tonapiClient } from 'src/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { Badge, Box, BoxProps, Button, Divider, Flex, Text, useToast } from '@chakra-ui/react';
import {
    TonConnectButton,
    useIsConnectionRestored,
    useTonAddress,
    useTonConnectModal,
    useTonWallet
} from '@tonconnect/ui-react';
import AirdropForm from 'src/features/airdrop/ui/AirdropForm';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';
import { useNavigate } from 'react-router-dom';
import { airdropsStore } from 'src/features';

const WALLET_W5_CODE_HASH = 'IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=';

async function checkJetton(address: string) {
    try {
        await tonapiClient.jettons.getJettonInfo(Address.parse(address));
        return true;
    } catch (error) {
        return false;
    }
}

const checkIsWalletW5 = (stateInit: string) => {
    const boc = Cell.fromBase64(stateInit);
    const code = boc.refs[0];
    const hash = code.hash().toString('base64');

    return hash === WALLET_W5_CODE_HASH;
};

const NewAirdropPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const connectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const toast = useToast();
    const userAddress = useTonAddress();
    const { open: openConnect } = useTonConnectModal();
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<AirdropMetadata>({});

    const formId = 'airdrops-form-id';

    useEffect(() => {
        if (connectionRestored && !!wallet?.account.walletStateInit) {
            const isW5 = checkIsWalletW5(wallet?.account.walletStateInit);

            if (!isW5) {
                toast({
                    title: 'Connect wallet W5',
                    description: 'Please reconnect with wallet W5',
                    position: 'bottom-left',
                    duration: 5000,
                    status: 'error',
                    isClosable: true
                });
            }
        }
    }, [wallet, connectionRestored]);

    const handleSubmit = async ({ name, address, fee }: AirdropMetadata) => {
        setIsLoading(true);
        const isValidJetton = await checkJetton(address);

        if (!isValidJetton) {
            methods.setError('address', { message: 'Jetton not found' });
            setIsLoading(false);
            return;
        }

        const id = await airdropsStore.createAirdrop({
            name,
            address,
            fee,
            adminAddress: userAddress
        });
        setIsLoading(false);
        navigate(`/jetton/airdrop?id=${id}`);
    };

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <Box>
                    <Flex align="center" direction="row" gap="8px">
                        <H4 mb="1">New Sending</H4>
                        <Badge
                            textStyle="label3"
                            color="accent.red"
                            bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                        >
                            MAINNET
                        </Badge>
                    </Flex>
                    <Text textStyle="body2" color="text.secondary">
                        Connect the wallet via TON Connect version W5 only. This address will serve
                        as the admin for the mailing list.
                    </Text>
                </Box>
                <TonConnectButton />
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="column" px="6">
                <FormProvider {...methods}>
                    <AirdropForm onSubmit={handleSubmit} id={formId} />
                </FormProvider>
                {userAddress ? (
                    <Button
                        flex={1}
                        maxW={600}
                        mt={4}
                        form={formId}
                        isLoading={isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Continue
                    </Button>
                ) : (
                    <Button flex={1} maxW={600} mt={4} onClick={openConnect} variant="primary">
                        Connect W5 Wallet
                    </Button>
                )}
            </Flex>
        </Overlay>
    );
};

export default observer(NewAirdropPage);
