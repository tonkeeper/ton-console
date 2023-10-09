import { FunctionComponent } from 'react';
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
import { Invoice, invoicesTableStore } from 'src/features';
import { observer } from 'mobx-react-lite';
import { H4, Span } from 'src/shared';

const CancelInvoiceConfirmation: FunctionComponent<{
    invoice: Invoice;
    isOpen: boolean;
    onClose: () => void;
}> = ({ invoice, isOpen, onClose }) => {
    const onConfirm = async (): Promise<void> => {
        await invoicesTableStore.cancelInvoice(invoice.id);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Cancel Invoice?</H4>
                    <Text textStyle="body2" color="text.secondary">
                        <Span>ID {invoice.id}</Span>
                        {invoice.description && <Span>&nbsp;·&nbsp;{invoice.description}</Span>}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Text textStyle="text.body2" color="text.secondary">
                        Are you sure you want to cancel this invoice? This action cannot be undone.
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Close
                    </Button>
                    <Button
                        flex={1}
                        isLoading={invoicesTableStore.cancelInvoice.isLoading}
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

export default observer(CancelInvoiceConfirmation);
