import { FunctionComponent } from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import { Invoice } from 'src/features';
import { ViewInvoiceModalContent } from 'src/features/invoices/ui/ViewInvoiceModalContent';

export const ViewInvoiceModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice;
}> = ({ isOpen, onClose, invoice }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ViewInvoiceModalContent onClose={onClose} invoice={invoice} />
        </Modal>
    );
};
