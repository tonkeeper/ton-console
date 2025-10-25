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
import { CreateApiKeyForm, useCreateApiKeyMutation } from '../model';
import { ApiKeyForm } from './ApiKeyForm';
import { FormProvider, useForm } from 'react-hook-form';
import { restApiTiersStore } from 'src/shared/stores';

interface CreateApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateApiKeyModal: FC<CreateApiKeyModalProps> = ({ isOpen, onClose }) => {
    const formId = 'create-api-key-form';
    const { mutate: createApiKey, isPending } = useCreateApiKeyMutation();

    const methods = useForm<CreateApiKeyForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateApiKeyForm): void => {
            createApiKey(form, {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        },
        [createApiKey, onClose, reset]
    );

    useEffect(() => {
        if (!isOpen) {
            setTimeout(reset, 200);
        }
    }, [reset, isOpen]);

    const maxLimit = restApiTiersStore.selectedTier$.value?.rps ?? 1;

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
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
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateApiKeyModal;
