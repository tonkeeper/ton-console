import { Flex, BoxProps, Button, Spinner, Text, useToast, Link } from '@chakra-ui/react';
import { Address } from '@ton/core';
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
    useTonConnectModal
} from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ContractDeployer } from 'src/features/jetton/lib/contract-deployer';
import {
    JettonDeployParams,
    jettonDeployController
} from 'src/features/jetton/lib/deploy-controller';
import { createDeployParams } from 'src/features/jetton/lib/utils';
import JettonForm, { RawJettonMetadata } from 'src/features/jetton/ui/minter/JettonForm';
import { H4, Overlay, fromDecimals, tonapiMainnet } from 'src/shared';

const DEFAULT_DECIMALS = 9;

const JettonNewPage: FC<BoxProps> = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const userAddress = useTonAddress();
    const { open: openConnect } = useTonConnectModal();
    const [tonconnect] = useTonConnectUI();
    const [isDeploying, setIsDeploying] = useState(false);

    const formId = 'jetton-form-id';

    const methods = useForm<RawJettonMetadata>({});

    const handleSubmit = async (form: RawJettonMetadata) => {
        setIsDeploying(true);

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

        const isDeployed = await tonapiMainnet.accounts
            .getAccount(contractAddress)
            .then(v => v.status === 'active');

        const jettonViewUrl = `/jetton/minter/view/${contractAddress.toString()}`;

        if (isDeployed) {
            setIsDeploying(false);
            toast({
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
                position: 'bottom-left',
                status: 'error',
                duration: 1000000,
                isClosable: true
            });
            return;
        }

        await jettonDeployController
            .createJetton(dataForMint, tonconnect)
            .then(() => navigate(jettonViewUrl))
            .catch(e =>
                toast({
                    title: 'Error',
                    description: e.message,
                    status: 'error',
                    position: 'bottom-left',
                    duration: 1000000,
                    isClosable: true
                })
            )
            .finally(() => {
                setIsDeploying(false);
            });
    };

    if (isDeploying) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
                <Text ml={2}>Deploying jetton contract...</Text>
            </Overlay>
        );
    }

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
                    isLoading={isDeploying}
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
