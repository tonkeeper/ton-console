import { Flex, BoxProps, Button, Text, Link } from '@chakra-ui/react';
import { Address } from '@ton/core';
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
    useTonConnectModal
} from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ContractDeployer } from 'src/features/jetton/lib/contract-deployer';
import {
    JettonDeployParams,
    jettonDeployController
} from 'src/features/jetton/lib/deploy-controller';
import { createDeployParams } from 'src/features/jetton/lib/utils';
import JettonForm, { RawJettonMetadata } from 'src/features/jetton/ui/minter/JettonForm';
import { H4, Overlay, fromDecimals, useToast, ta } from 'src/shared';

const DEFAULT_DECIMALS = 9;

const JettonNewPage: FC<BoxProps> = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const userAddress = useTonAddress();
    const { open: openConnect } = useTonConnectModal();
    const [tonconnect] = useTonConnectUI();

    const formId = 'jetton-form-id';

    const methods = useForm<RawJettonMetadata>({});

    const handleSubmit = async (form: RawJettonMetadata) => {
        const toastId = toast({
            title: 'Deploying jetton contract',
            description:
                'The process of creating and launching a smart contract to issue and manage a Jetton token on the blockchain will take some time.',
            duration: null,
            status: 'loading',
            isClosable: false
        });

        const dataForMint: JettonDeployParams = {
            onchainMetaData: {
                name: form.name,
                symbol: form.symbol,
                description: form.description,
                decimals: form.decimals,
                image: form.image
            },
            offchainUri: undefined,
            owner: Address.parse(userAddress),
            amountToMint: fromDecimals(form.mint, form.decimals ?? DEFAULT_DECIMALS)
        };

        const deployParams = await createDeployParams(dataForMint, dataForMint.offchainUri);
        const contractAddress = new ContractDeployer().addressForContract(deployParams);

        const isDeployed = await ta.accounts
            .getAccount(contractAddress)
            .then(v => v.status === 'active');

        const jettonViewUrl = `/jetton/view?address=${contractAddress.toString()}`;

        if (isDeployed) {
            toast.update(toastId, {
                title: 'Contract already deployed',
                description: (
                    <Text>
                        This contract already exists. You can view it{' '}
                        <Link
                            textStyle="body1"
                            color="constant.white"
                            textDecoration="underline"
                            href={jettonViewUrl}
                        >
                            here
                        </Link>
                    </Text>
                ),
                status: 'error',
                duration: 20000,
                isClosable: true
            });
            return;
        }

        await jettonDeployController
            .createJetton(dataForMint, tonconnect)
            .then(() => {
                toast.update(toastId, {
                    status: 'success',
                    title: 'Jetton contract deployed',
                    duration: 20000,
                    isClosable: true
                });
                navigate(jettonViewUrl);
            })
            .catch(e =>
                toast.update(toastId, {
                    title: 'Error',
                    description: e.message,
                    status: 'error',
                    duration: 20000,
                    isClosable: true
                })
            );
    };

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>New Jetton</H4>
                <TonConnectButton />
            </Flex>
            <FormProvider {...methods}>
                <JettonForm onSubmit={handleSubmit} id={formId} />
            </FormProvider>
            {userAddress ? (
                <Button
                    flex={1}
                    maxW={600}
                    mt={4}
                    form={formId}
                    isLoading={methods.formState.isSubmitting}
                    type="submit"
                    variant="primary"
                >
                    Mint
                </Button>
            ) : (
                <Button flex={1} maxW={600} mt={4} onClick={openConnect} variant="primary">
                    Connect Wallet
                </Button>
            )}
        </Overlay>
    );
};

export default observer(JettonNewPage);
