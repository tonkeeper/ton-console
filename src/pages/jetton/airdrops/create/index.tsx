import { Address, Cell } from '@ton/core';
import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, tonapiClient } from 'src/shared';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Box,
    BoxProps,
    Button,
    Checkbox,
    Divider,
    Flex,
    Text,
    Link,
    useToast,
    Center,
    Spinner
} from '@chakra-ui/react';
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
import { InfoComponent } from './InfoComponent';
import { airdropsStore, projectsStore } from 'src/shared/stores';
import { AirdropStore } from 'src/features/airdrop/model/airdrop.store';

const checkJetton = (address: string): Promise<boolean> =>
    tonapiClient.jettons.getJettonInfo(Address.parse(address)).then(
        () => true, // onFulfilled
        () => false // onRejected
    );

const checkIsWalletW5 = (stateInit: string) => {
    const WALLET_W5_CODE_HASH = 'IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=';
    const boc = Cell.fromBase64(stateInit);
    const code = boc.refs[0];
    const hash = code.hash().toString('base64');

    return hash === WALLET_W5_CODE_HASH;
};

const CreateAirdropPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const connectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const toast = useToast();
    const userAddress = useTonAddress();
    const { open: openConnect } = useTonConnectModal();
    const [isLoading, setIsLoading] = useState(false);
    const [terms1Checked, setTerms1Checked] = useState(false);
    const [terms2Checked, setTerms2Checked] = useState(false);

    const config = airdropsStore.config$.value;

    const methods = useForm<AirdropMetadata>({
        mode: 'onSubmit'
    });

    const formId = 'airdrops-form-id';

    const showWalletError = () => {
        toast({
            title: 'Connect wallet W5',
            description: 'Please reconnect with wallet W5',
            position: 'bottom-left',
            duration: 5000,
            status: 'error',
            isClosable: true
        });
    };

    useEffect(() => {
        if (connectionRestored && !!wallet?.account.walletStateInit) {
            const isW5 = checkIsWalletW5(wallet?.account.walletStateInit);

            if (!isW5) {
                showWalletError();
            }
        }
    }, [wallet, connectionRestored]);

    const handleSubmit = async ({ name, address, fee, vesting }: AirdropMetadata) => {
        if (!checkIsWalletW5(wallet?.account.walletStateInit || '')) {
            showWalletError();
            return;
        }
        setIsLoading(true);
        const isValidJetton = await checkJetton(address);

        if (!isValidJetton) {
            methods.setError('address', { message: 'Jetton not found' });
            setIsLoading(false);
            return;
        }

        const airdropStore = new AirdropStore({
            projectId: projectsStore.selectedProject!.id,
            airdrops: airdropsStore.airdrops$.value
        });

        const id = await airdropStore.createAirdrop({
            name,
            address,
            fee,
            vesting,
            adminAddress: userAddress
        });
        setIsLoading(false);
        navigate(`/jetton/airdrops/${id}`);
    };

    if (!airdropsStore.config$.isResolved || !config) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column" px="0">
            <Flex align="flex-start" justify="space-between" mb="5" px="6">
                <Box>
                    <Flex align="center" direction="row" gap="8px">
                        <H4 mb="1">New Airdrop</H4>
                    </Flex>
                    <Text textStyle="body2" color="text.secondary">
                        Fill in the details and connect your wallet
                    </Text>
                </Box>
                <TonConnectButton />
            </Flex>
            <Divider mb="3" />
            <Flex align="flex-start" direction="column" gap="24px" maxW="550px" px="6">
                <Flex align="flex-start" direction="column" gap="12px">
                    <FormProvider {...methods}>
                        <AirdropForm onSubmit={handleSubmit} id={formId} />
                        <Text textStyle="label2" color="text.secondary">
                            Royalty coefficient:{' '}
                            {config.royalty_numerator / config.royalty_denominator} (see it in
                            Airdop T&C Terms)
                        </Text>
                    </FormProvider>
                    <Checkbox
                        checked={terms1Checked}
                        onChange={() => setTerms1Checked(!terms1Checked)}
                    >
                        <Text textStyle="label2" color="text.secondary">
                            I have read and agree with the{' '}
                            <Link
                                textStyle="label2"
                                color="accent.blue"
                                href="https://docs.tonconsole.com/tonconsole/jettons/airdrop/terms"
                                isExternal
                            >
                                Airdrop Terms of Use
                            </Link>
                        </Text>
                    </Checkbox>
                    <Checkbox
                        checked={terms2Checked}
                        onChange={() => setTerms2Checked(!terms2Checked)}
                    >
                        <Text textStyle="label2" color="text.secondary">
                            I have read and agree with the{' '}
                            <Link
                                textStyle="label2"
                                color="accent.blue"
                                href="https://docs.tonconsole.com/tonconsole/jettons/airdrop"
                                isExternal
                            >
                                Airdop T&C Terms
                            </Link>
                        </Text>
                    </Checkbox>
                    {userAddress ? (
                        <Button
                            flex={1}
                            maxW={600}
                            mt={4}
                            form={formId}
                            isDisabled={!terms1Checked || !terms2Checked}
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
                <InfoComponent />
            </Flex>
        </Overlay>
    );
};

export default observer(CreateAirdropPage);
