import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import { FC } from 'react';
import { CreateSubscriptionsPlanForm } from './create-subscriptions-plan-form';

export const CreateSubscriptionsPlan: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <>
            <Box w="560px" px="24px">
                <CreateSubscriptionsPlanForm />
            </Box>

            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Subscription plan</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CreateSubscriptionsPlanForm />
                    </ModalBody>

                    <ModalFooter gap="3">
                        <Button flex={1} onClick={onClose} variant="secondary">
                            Cancel
                        </Button>
                        <Button flex={1} variant="primary">
                            Deploy
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
