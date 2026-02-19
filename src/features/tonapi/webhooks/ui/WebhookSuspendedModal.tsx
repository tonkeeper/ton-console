import { FC } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    Box
} from '@chakra-ui/react';

interface WebhookSuspendedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRefill: () => void;
}

const WebhookSuspendedModal: FC<WebhookSuspendedModalProps> = ({
    isOpen,
    onClose,
    onOpenRefill
}) => {
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Webhook Suspended</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="flex-start" spacing="4">
                        <Text color="text.secondary">
                            This webhook has been suspended due to insufficient balance. To
                            restore it, please top up your account balance.
                        </Text>
                        <Box
                            w="100%"
                            p="3"
                            bg="status.error.background"
                            borderColor="status.error.foreground"
                            borderLeft="3px solid"
                            borderRadius="8px"
                        >
                            <Text color="status.error.foreground" fontSize="sm">
                                After topping up your balance, please click the &quot;Try
                                Online&quot; button on the webhook page to restore the connection.
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button onClick={onClose} variant="secondary">
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            onOpenRefill();
                        }}
                        variant="primary"
                    >
                        Top Up Balance
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default WebhookSuspendedModal;
