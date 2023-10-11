import { FunctionComponent } from 'react';
import { ButtonLink, H3, InvoiceIcon40, Overlay } from 'src/shared';
import { Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { INVOICES_LINKS } from 'src/features';
const JoinInvoices: FunctionComponent = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <InvoiceIcon40 mb="5" />
            <H3 mb="4">Invoices</H3>
            <Text textStyle="body2" maxW="392px" mb="9" color="text.secondary" textAlign="center">
                Invoices service simplifies in-TON payment tracking and reconciliation for partners
                by offering an intuitive API and user-friendly admin panel, enabling seamless
                monitoring of blockchain payments and enhancing transparency and accountability in
                financial transactions.
            </Text>

            <Flex gap="5">
                <ButtonLink
                    variant="secondary"
                    isExternal
                    href={INVOICES_LINKS.BUSINESS_DESCRIPTION}
                >
                    Documentation
                </ButtonLink>
                <ButtonLink isExternal href={INVOICES_LINKS.JOIN_CONTACT}>
                    Join invoices
                </ButtonLink>
            </Flex>
        </Overlay>
    );
};

export default observer(JoinInvoices);
