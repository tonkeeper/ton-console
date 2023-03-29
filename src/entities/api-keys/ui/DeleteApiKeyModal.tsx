import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { ApiKey, apiKeysStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const DeleteApiKeyModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, ...rest }) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!rest.isOpen) {
            setInputValue('');
        }
    }, [rest.isOpen]);

    const onConfirm = useCallback(() => {
        if (apiKey) {
            apiKeysStore.deleteApiKey(apiKey.id).then(rest.onClose);
        }
    }, [apiKey]);

    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Delete {apiKey?.name}?</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <Text textStyle="text.body2" mb="6" color="text.secondary" textAlign="center">
                        This action cannot be canceled. To confirm, please enter the name of the
                        key.
                    </Text>
                    <Input
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Name"
                        value={inputValue}
                    />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={rest.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isDisabled={!apiKey?.name || inputValue !== apiKey?.name}
                        isLoading={apiKeysStore.deleteApiKey.isLoading}
                        onClick={onConfirm}
                        type="submit"
                        variant="primary"
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(DeleteApiKeyModal);
