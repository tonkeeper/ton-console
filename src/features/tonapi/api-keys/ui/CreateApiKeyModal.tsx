import { FunctionComponent, useCallback } from 'react';
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
import { apiKeysStore } from '../model/api-keys.store';
import { ApiKeyForm } from './ApiKeyForm';

const CreateApiKeyModal: FunctionComponent<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-api-key-form';

    const onSubmit = useCallback(
        (form: { name: string }): void => {
            apiKeysStore.createApiKey(form).then(props.onClose);
        },
        [props.onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New API key</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ApiKeyForm id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
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
