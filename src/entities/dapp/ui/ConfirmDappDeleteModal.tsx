import { FunctionComponent } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';

export const ConfirmDappDeleteModal: FunctionComponent<{
    appUrl: string;
    isOpen: boolean;
    onClose: (confirm?: boolean) => void;
}> = ({ appUrl, ...rest }) => {
    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    Are you sure you want to delete the dApp?
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <Text textStyle="text.body2" mb="6" color="text.secondary" textAlign="center">
                        Delete {appUrl}?
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => rest.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        onClick={() => rest.onClose(true)}
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
