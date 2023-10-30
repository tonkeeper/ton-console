import { FunctionComponent, useId, useState } from 'react';
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
import { CreateInvoiceFrom } from './CreateInvoiceFrom';
import { Invoice } from 'src/features';
import { ViewInvoiceModalContent } from './ViewInvoiceModalContent';
import { invoicesTableStore } from '../models';

const CreateInvoiceModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

    const id = useId();

    const closeHandler = (): void => {
        if (!invoicesTableStore.createInvoice.isLoading) {
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
                                invoicesTableStore.createInvoice(form).then(setCreatedInvoice)
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
                            isLoading={invoicesTableStore.createInvoice.isLoading}
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

export default observer(CreateInvoiceModal);
