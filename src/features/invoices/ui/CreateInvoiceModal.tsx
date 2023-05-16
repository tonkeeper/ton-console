import { FunctionComponent, useId } from 'react';
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
import { observer } from 'mobx-react-lite';
import { CreateInvoiceFrom } from 'src/features/invoices/ui/CreateInvoiceFrom';

const CreateInvoiceModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const id = useId();

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>New Invoice</ModalHeader>
                <ModalBody>
                    <CreateInvoiceFrom id={id} onSubmit={console.log} />
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

export default observer(CreateInvoiceModal);
