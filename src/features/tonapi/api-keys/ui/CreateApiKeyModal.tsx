import { FC, useCallback, useEffect } from 'react';
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
import { apiKeysStore, CreateApiKeyForm } from '../model';
import { ApiKeyForm } from './ApiKeyForm';
import { tonApiTiersStore } from '../../pricing';
import { FormProvider, useForm } from 'react-hook-form';

const CreateApiKeyModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-api-key-form';

    const methods = useForm<CreateApiKeyForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateApiKeyForm): void => {
            apiKeysStore.createApiKey(form).then(props.onClose);
        },
        [props.onClose]
    );

    useEffect(() => {
        if (!props.isOpen) {
            setTimeout(reset, 200);
        }
    }, [reset, props.isOpen]);

    const maxLimit = tonApiTiersStore.selectedTier$.value?.description.requestsPerSecondLimit || 1;

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New API key</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <ApiKeyForm id={formId} maxLimit={maxLimit} onSubmit={onSubmit} />
                    </FormProvider>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={apiKeysStore.createApiKey.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(CreateApiKeyModal);
