import { FC } from 'react';
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
import { Invoice } from '../models';
import { H4, Span } from 'src/shared';

interface Props {
    invoice: Invoice;
    isOpen: boolean;
    onClose: () => void;
    onCancelInvoice: (invoiceId: string) => Promise<void>;
    isLoading?: boolean;
}

const CancelInvoiceConfirmation: FC<Props> = ({ invoice, isOpen, onClose, onCancelInvoice, isLoading = false }) => {
    const onConfirm = async (): Promise<void> => {
        await onCancelInvoice(invoice.id);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Cancel Invoice</H4>
                    <Text textStyle="body2" color="text.secondary">
                        <Span>ID {invoice.id}</Span>
                        {invoice.description && <Span>&nbsp;·&nbsp;{invoice.description}</Span>}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Text textStyle="text.body2" color="text.secondary">
                        Cancel this invoice? You cannot revert this action.
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Close
                    </Button>
                    <Button
                        flex={1}
                        isLoading={isLoading}
                        onClick={onConfirm}
                        type="submit"
                        variant="primary"
                    >
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancelInvoiceConfirmation;
