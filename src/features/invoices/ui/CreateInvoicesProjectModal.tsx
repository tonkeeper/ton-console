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
import { InvoicesAppStore } from '../models';
import { observer } from 'mobx-react-lite';

interface Props {
    invoicesAppStore: InvoicesAppStore;
    isOpen: boolean;
    onClose: () => void;
}

const CreateInvoicesProjectModal: FC<Props> = ({ invoicesAppStore, isOpen, onClose }) => {
    const id = useId();

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
                        onSubmit={form => invoicesAppStore.createInvoicesApp(form)}
                    />
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={id}
                        isLoading={invoicesAppStore.createInvoicesApp.isLoading}
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

export default observer(CreateInvoicesProjectModal);
