import { FunctionComponent, useId } from 'react';
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
import { EditInvoicesProjectForm } from './EditInvoicesProjectForm';
import { H4 } from 'src/shared';

export const CreateInvoicesProjectModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const id = useId();

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader borderBottom="1px" borderBottomColor="separator.common">
                    <H4>New Project</H4>
                    <Text textStyle="body2" color="text.secondary">
                        This information will be displayed in the invoices that you create.
                    </Text>
                </ModalHeader>
                <ModalBody>
                    <EditInvoicesProjectForm id={id} onSubmit={console.log} />
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} form={id} isLoading={false} type="submit" variant="primary">
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
