import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay, Span } from 'src/shared';
import { InvoicesProjectInfo } from 'src/features';
import { Button, Flex } from '@chakra-ui/react';

const ManageInvoicesPage: FunctionComponent = () => {
    return (
        <Overlay>
            <H4 mb="1">Invoices</H4>
            <InvoicesProjectInfo mb="5" />
            <Flex justify="space-between">
                <Span>search</Span>
                <Button size="lg" variant="primary">
                    New Invoice
                </Button>
            </Flex>
        </Overlay>
    );
};

export default observer(ManageInvoicesPage);
