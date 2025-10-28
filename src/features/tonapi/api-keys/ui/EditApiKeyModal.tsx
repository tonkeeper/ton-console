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
import { FormProvider, useForm } from 'react-hook-form';
import { ApiKey, CreateApiKeyForm, useEditApiKeyMutation } from '../model';
import { ApiKeyForm, ApiKeyFormInternal, toApiKeyFormDefaultValues } from './ApiKeyForm';
import { useSelectedRestApiTier } from 'src/features/tonapi/pricing/model/queries';

const EditApiKeyModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, onClose, ...rest }) => {
    const formId = 'create-api-key-form';
    const { mutate: editApiKey, isPending } = useEditApiKeyMutation();

    const methods = useForm<ApiKeyFormInternal>({
        defaultValues: toApiKeyFormDefaultValues(apiKey)
    });

    useEffect(() => {
        methods.reset(toApiKeyFormDefaultValues(apiKey));
    }, [apiKey, methods]);

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateApiKeyForm): void => {
            if (apiKey) {
                editApiKey(
                    {
                        id: apiKey.id,
                        ...form
                    },
                    {
                        onSuccess: () => {
                            reset();
                            onClose();
                        }
                    }
                );
            }
        },
        [apiKey, editApiKey, onClose, reset]
    );

    const { data: selectedTier } = useSelectedRestApiTier();
    const maxLimit = selectedTier?.rps ?? 1;

    return (
        <Modal onClose={onClose} scrollBehavior="inside" {...rest}>
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
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={isPending}
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

export default EditApiKeyModal;
