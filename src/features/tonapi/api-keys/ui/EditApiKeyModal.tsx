import { FunctionComponent, useCallback, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FormProvider, useForm } from 'react-hook-form';
import { ApiKey, apiKeysStore, CreateApiKeyForm } from '../model';
import { ApiKeyForm, toApiKeyFormDefaultValues } from './ApiKeyForm';

const EditApiKeyModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, ...rest }) => {
    const formId = 'create-api-key-form';

    const methods = useForm<CreateApiKeyForm>({ defaultValues: toApiKeyFormDefaultValues(apiKey) });

    useEffect(() => {
        reset(toApiKeyFormDefaultValues(apiKey));
    }, [apiKey]);

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateApiKeyForm): void => {
            if (apiKey) {
                apiKeysStore.editApiKey({ id: apiKey.id, ...form }).then(rest.onClose);
            }
        },
        [apiKey, rest.onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{apiKey?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <ApiKeyForm onSubmit={onSubmit} id={formId} />
                    </FormProvider>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={rest.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={apiKeysStore.editApiKey.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(EditApiKeyModal);
