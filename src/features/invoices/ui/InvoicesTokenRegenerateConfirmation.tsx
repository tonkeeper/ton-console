import { FunctionComponent } from 'react';
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
import { invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';

const InvoicesTokenRegenerateConfirmation: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const onConfirm = (): Promise<void> => invoicesAppStore.regenerateAppToken().then(onClose);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Regenerate the token?</ModalHeader>
                <ModalCloseButton />
                <ModalBody pt="0" pb="2">
                    If you regenerate the token, the previous token will no longer work
                </ModalBody>
                <ModalFooter gap="3" pt="4">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={invoicesAppStore.regenerateAppToken.isLoading}
                        onClick={onConfirm}
                        variant="primary"
                    >
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(InvoicesTokenRegenerateConfirmation);
