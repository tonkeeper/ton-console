import { Flex, BoxProps, Button, Spinner } from '@chakra-ui/react';
import { Address } from '@ton/core';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { JettonStore } from 'src/features';
import JettonForm, {
    RawJettonMetadata,
    toRawJettonMetadataDefaultValues
} from 'src/features/jetton/ui/minter/JettonForm';
import { H4, Overlay } from 'src/shared';

const JettonViewPage: FC<BoxProps> = () => {
    const jettonStore = useLocalObservable(() => new JettonStore());
    const userAddress = useTonAddress();

    useEffect(() => {
        if (userAddress) {
            const address = Address.parse(userAddress);
            jettonStore.fetchJettonDetails(address);
        }
    }, [userAddress, jettonStore]);

    const formId = 'jetton-form-id';

    const methods = useForm<RawJettonMetadata>({
        defaultValues: toRawJettonMetadataDefaultValues(jettonStore.jettonData$.value)
    });

    useEffect(() => {
        reset(toRawJettonMetadataDefaultValues(jettonStore.jettonData$.value));
    }, [jettonStore.jettonData$.value]);

    const {
        reset
        // formState: { isDirty }
    } = methods;

    // const handleSubmit = (form: JettonFormProps) => {
    //     // Здесь логика обработки формы
    //     console.log('Submitted data: ', form);
    // };

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
                <H4>Mint your token</H4>
                <TonConnectButton />
            </Flex>
            {jettonStore.jettonData$.value === null ? (
                <Overlay display="flex" justifyContent="center" alignItems="center">
                    <H4>Jetton not found</H4>
                </Overlay>
            ) : (
                <>
                    <FormProvider {...methods}>
                        <JettonForm onSubmit={() => alert('Mint Jettons')} id={formId} />
                    </FormProvider>
                    <Button
                        flex={1}
                        maxW={600}
                        mt={4}
                        form={formId}
                        type="submit"
                        variant="primary"
                    >
                        Mint
                    </Button>
                </>
            )}
        </Overlay>
    );
};

export default observer(JettonViewPage);
