import { ComponentProps, FunctionComponent } from 'react';
import { Box, Divider } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay } from 'src/shared';
import { InvoicesProjectInfo } from 'src/features';
import InvoicesStats from './InvoicesStats';
import InvoicesAuthorization from './InvoicesAuthorization';
import InvoicesWebhooks from './InvoicesWebhooks';
import InvoicesApi from './InvoicesApi';

const InvoiceDashboardPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Overlay {...props}>
            <H4 mb="1">Overview</H4>
            <InvoicesProjectInfo mb="5" />
            <Divider w="auto" mb="5" mx="-6" />
            <InvoicesStats mb="6" />
            <Divider w="auto" mb="5" mx="-6" />
            <InvoicesAuthorization />
            <Divider w="auto" mb="5" mx="-6" />
            <InvoicesWebhooks mb="6" />
            <InvoicesApi />
        </Overlay>
    );
};

export default observer(InvoiceDashboardPage);
