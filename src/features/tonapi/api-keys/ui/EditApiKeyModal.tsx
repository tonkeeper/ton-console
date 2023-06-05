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
import { useForm } from 'react-hook-form';
import { ApiKey, apiKeysStore } from '../model';
import { ApiKeyForm } from './ApiKeyForm';

const EditApiKeyModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, ...rest }) => {
    const formId = 'create-api-key-form';

    const {
        reset,
        formState: { isDirty }
    } = useForm<{ name: string }>();

    useEffect(() => {
        reset({ name: apiKey?.name });
    }, [apiKey]);

    const onSubmit = useCallback(
        (form: { name: string }): void => {
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
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore TODO */}
                    <ApiKeyForm onSubmit={onSubmit} id={formId} defaultValues={apiKey} />
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
