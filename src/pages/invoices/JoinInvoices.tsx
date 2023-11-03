import { FunctionComponent } from 'react';
import { ButtonLink, H3, InvoiceIcon40, Overlay } from 'src/shared';
import { Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { INVOICES_LINKS } from 'src/features';
const JoinInvoices: FunctionComponent = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <InvoiceIcon40 mb="5" />
            <H3 mb="4">Track TON Payments</H3>
            <Text textStyle="body2" maxW="392px" mb="9" color="text.secondary" textAlign="center">
                Keep track of your operations with Payment Tracker: a simple yet powerful service
                for managing TON transactions. Contact us to start using it today!
            </Text>

            <Flex gap="5">
                <ButtonLink
                    size="md"
                    variant="secondary"
                    isExternal
                    href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                >
                    Read Guide
                </ButtonLink>
                <ButtonLink isExternal href={INVOICES_LINKS.JOIN_CONTACT}>
                    Contact Us
                </ButtonLink>
            </Flex>
        </Overlay>
    );
};

export default observer(JoinInvoices);
