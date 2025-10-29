import { FC } from 'react';
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
import { appMessagesStore } from '../model';
import { useDappsQuery } from 'src/entities/dapp/model/queries';

const MessagesTokenRegenerateConfirmation: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { data: dapps } = useDappsQuery();
    const dappId = dapps?.[0]?.id;

    const onConfirm = (): Promise<void> => {
        if (!dappId) return Promise.reject('No dapp selected');
        return appMessagesStore.regenerateDappToken(dappId).then(onClose);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Generate new token?</ModalHeader>
                <ModalCloseButton />
                <ModalBody pt="0" pb="2">
                    If you generate new the token, the previous token will no longer work
                </ModalBody>
                <ModalFooter gap="3" pt="4">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={appMessagesStore.regenerateDappToken.isLoading}
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

export default MessagesTokenRegenerateConfirmation;
