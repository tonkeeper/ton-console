import {
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
import { FunctionComponent } from 'react';

export const CreateSubscriptionsPlan: FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Lorem count
                        <br />
                        Lorem count Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                        Lorem count
                        <br />
                    </ModalBody>

                    <ModalFooter gap="3">
                        <Button flex={1} mr={3} colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                        <Button flex={1} variant="ghost">
                            Secondary Action
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
