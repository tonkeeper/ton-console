import { ComponentProps, FunctionComponent } from 'react';
import { Box, Divider } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay } from 'src/shared';
import { InvoicesProjectInfo } from 'src/features';
import InvoicesStats from './InvoicesStats';
import InvoicesAuthorization from './InvoicesAuthorization';

const ApiDescriptionPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Overlay {...props}>
            <H4 mb="1">Invoices Api</H4>
            <InvoicesProjectInfo mb="5" />
            <Divider w="auto" mb="5" mx="-6" />
            <InvoicesStats mb="6" />
            <Divider w="auto" mb="5" mx="-6" />
            <InvoicesAuthorization />
        </Overlay>
    );
};

export default observer(ApiDescriptionPage);
