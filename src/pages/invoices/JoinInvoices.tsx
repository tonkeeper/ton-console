import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';
import { Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
const JoinInvoices: FunctionComponent = () => {
    return (
        <Overlay>
            <H4 mb="1">Join Invoices</H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Description
            </Text>
        </Overlay>
    );
};

export default observer(JoinInvoices);
