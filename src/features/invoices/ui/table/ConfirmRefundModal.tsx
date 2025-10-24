import { FC } from 'react';
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
import { H4, Span } from 'src/shared';
import { Invoice } from '../../models';

export const ConfirmRefundModal: FC<{
    invoice?: Invoice;
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose, invoice }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Refund</H4>
                </ModalHeader>
                <ModalBody>
                    <Span>
                        Send {invoice?.overpayment!.stringCurrencyAmount} to. You should then mark
                        the invoice as refanded yourself. The funds will be debited from the wallet
                        tone you selected, not the console tone balance.
                    </Span>
                </ModalBody>
                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} isLoading={false} type="submit" variant="primary">
                        Send
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
