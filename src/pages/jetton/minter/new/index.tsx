import { Flex, BoxProps, Button } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ContractDeployer } from 'src/features/jetton/lib/contract-deployer';
import {
    JettonDeployParams,
    jettonDeployController
} from 'src/features/jetton/lib/deploy-controller';
import { createDeployParams, toDecimals } from 'src/features/jetton/lib/utils';
import JettonForm, { RawJettonMetadata } from 'src/features/jetton/ui/minter/JettonForm';
import { H4, Overlay, tonApiClient } from 'src/shared';

const DEFAULT_DECIMALS = 9;

const JettonNewPage: FC<BoxProps> = () => {
    const navigate = useNavigate();
    const userAddress = useTonAddress();
    const [tonconnect] = useTonConnectUI();

    const formId = 'jetton-form-id';

    const methods = useForm<RawJettonMetadata>({});

    const handleSubmit = async (form: RawJettonMetadata) => {
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
            amountToMint: toDecimals(form.mint, form.decimals ?? DEFAULT_DECIMALS)
        };

        const deployParams = await createDeployParams(dataForMint, dataForMint.offchainUri);
        const contractAddress = new ContractDeployer().addressForContract(deployParams);

        const isDeployed = await tonApiClient.accounts
            .getAccount(contractAddress)
            .then(v => v.status === 'active');

        if (isDeployed) {
            console.log('Contract already deployed'); // TODO: show error
            return;
        }

        const deployedContract = await jettonDeployController.createJetton(dataForMint, tonconnect);

        navigate(`/jetton/minter/view?address=${deployedContract.toString()}`);
    };

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Mint your token</H4>
                <TonConnectButton />
            </Flex>
            <FormProvider {...methods}>
                <JettonForm onSubmit={handleSubmit} id={formId} />
            </FormProvider>
            <Button flex={1} maxW={600} mt={4} form={formId} type="submit" variant="primary">
                Mint
            </Button>
        </Overlay>
    );
};

export default observer(JettonNewPage);
