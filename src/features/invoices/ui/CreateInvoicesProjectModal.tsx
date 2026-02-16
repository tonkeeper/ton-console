import { FC, useId } from 'react';
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
import { EditInvoicesProjectForm } from './EditInvoicesProjectForm';
import { H4 } from 'src/shared';
import { useInvoicesApp } from '../models';
import type { InvoicesProjectForm } from '../models';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateInvoicesProjectModal: FC<Props> = ({ isOpen, onClose }) => {
    const id = useId();
    const { createApp, isCreatingApp } = useInvoicesApp();

    const handleSubmit = (form: InvoicesProjectForm) => {
        createApp(form);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>New Project</H4>
                </ModalHeader>
                <ModalBody py="0">
                    <EditInvoicesProjectForm
                        id={id}
                        onSubmit={handleSubmit}
                    />
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={id}
                        isLoading={isCreatingApp}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateInvoicesProjectModal;
