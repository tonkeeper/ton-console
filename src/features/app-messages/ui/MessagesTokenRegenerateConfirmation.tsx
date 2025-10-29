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
import { useDappsQuery } from 'src/entities/dapp/model/queries';
import { useRegenerateDappTokenMutation } from '../model/queries';

const MessagesTokenRegenerateConfirmation: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { data: dapps } = useDappsQuery();
    const dappId = dapps?.[0]?.id;
    const regenerateMutation = useRegenerateDappTokenMutation();

    const onConfirm = (): void => {
        if (!dappId) return;
        regenerateMutation.mutate(dappId, {
            onSuccess: onClose
        });
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
                        isLoading={regenerateMutation.isPending}
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
