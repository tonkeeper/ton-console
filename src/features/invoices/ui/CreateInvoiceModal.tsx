import { FC, useId, useState } from 'react';
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
import { CreateInvoiceFrom } from './CreateInvoiceFrom';
import { Invoice, InvoiceForm } from '../models';
import { ViewInvoiceModalContent } from './ViewInvoiceModalContent';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreateInvoice: (form: InvoiceForm) => Promise<Invoice>;
    isLoading?: boolean;
}

const CreateInvoiceModal: FC<Props> = ({ isOpen, onClose, onCreateInvoice, isLoading = false }) => {
    const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

    const id = useId();

    const closeHandler = (): void => {
        if (!isLoading) {
            setCreatedInvoice(null);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeHandler} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            {createdInvoice ? (
                <ViewInvoiceModalContent onClose={closeHandler} invoice={createdInvoice} />
            ) : (
                <ModalContent maxH="calc(100% - 3rem)" my="3">
                    <ModalCloseButton />
                    <ModalHeader>New Invoice</ModalHeader>
                    <ModalBody>
                        <CreateInvoiceFrom
                            id={id}
                            onSubmit={form =>
                                onCreateInvoice(form).then(setCreatedInvoice)
                            }
                        />
                    </ModalBody>
                    <ModalFooter gap="3">
                        <Button flex={1} onClick={closeHandler} variant="secondary">
                            Cancel
                        </Button>
                        <Button
                            flex={1}
                            form={id}
                            isLoading={isLoading}
                            type="submit"
                            variant="primary"
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            )}
        </Modal>
    );
};

export default CreateInvoiceModal;
