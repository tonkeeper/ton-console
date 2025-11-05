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
import type { InvoicesProjectForm, InvoicesApp } from '../models';

interface Props {
    invoicesApp: {
        app: InvoicesApp | null | undefined;
        editApp: (form: InvoicesProjectForm & { id: number }) => void;
        isEditingApp: boolean;
    };
    isOpen: boolean;
    onClose: () => void;
}

const EditInvoicesProjectModal: FC<Props> = ({ invoicesApp, isOpen, onClose }) => {
    const id = useId();

    const app = invoicesApp.app;

    const defaultValues: Partial<InvoicesProjectForm> | undefined = app
        ? {
              name: app.name,
              receiverAddress: app.receiverAddress.toString()
          }
        : undefined;

    const handleSubmit = (form: InvoicesProjectForm) => {
        if (app) {
            invoicesApp.editApp({ ...form, id: app.id });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Edit Project</H4>
                </ModalHeader>
                <ModalBody py="0">
                    {!!app && (
                        <EditInvoicesProjectForm
                            defaultValues={defaultValues}
                            id={id}
                            onSubmit={handleSubmit}
                        />
                    )}
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={id}
                        isLoading={invoicesApp.isEditingApp}
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

export default EditInvoicesProjectModal;
