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
import { ApiKey, CreateApiKeyForm } from '../model';
import { ApiKeyForm, ApiKeyFormInternal, toApiKeyFormDefaultValues } from './ApiKeyForm';
import { tonApiTiersStore } from 'src/shared/stores';
import { apiKeysStore } from 'src/shared/stores';

const EditApiKeyModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, ...rest }) => {
    const formId = 'create-api-key-form';

    const methods = useForm<ApiKeyFormInternal>({
        defaultValues: toApiKeyFormDefaultValues(apiKey)
    });

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
                apiKeysStore
                    .editApiKey({
                        id: apiKey.id,
                        ...form
                    })
                    .then(rest.onClose);
            }
        },
        [apiKey, rest.onClose]
    );

    const maxLimit = tonApiTiersStore.selectedTier$.value?.description.requestsPerSecondLimit || 1;

    return (
        <Modal scrollBehavior="inside" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit API Key</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <ApiKeyForm onSubmit={onSubmit} id={formId} maxLimit={maxLimit} />
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
