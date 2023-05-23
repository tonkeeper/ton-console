import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay } from 'src/shared';
import {
    CreateInvoiceModal,
    InvoicesProjectInfo,
    InvoicesSearchInput,
    InvoicesTable
} from 'src/features';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';

const ManageInvoicesPage: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <Overlay display="flex" flexDirection="column">
            <H4 mb="1">Invoices</H4>
            <InvoicesProjectInfo mb="5" />
            <Flex justify="space-between" mb="9">
                <InvoicesSearchInput w="264px" />
                <Button onClick={onOpen} size="lg" variant="primary">
                    New Invoice
                </Button>
            </Flex>
            <InvoicesTable flex="1 1 auto" />
            <CreateInvoiceModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};

export default observer(ManageInvoicesPage);
