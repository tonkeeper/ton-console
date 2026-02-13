import { FC } from 'react';
import { ButtonLink, H3, InvoiceIcon40, Overlay } from 'src/shared';
import { Button, Flex, Text } from '@chakra-ui/react';
import { INVOICES_LINKS } from '../models/INVOICES_LINKS';
import { openFeedbackModal } from 'src/features/feedback';

/**
 * Component displayed when invoices service is unavailable (400 error)
 * Shown when the API returns 400, indicating the service is not available for this project
 */
export const UnavailableInvoices: FC = () => {
    return (
        <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
            <InvoiceIcon40 mb="5" />
            <H3 mb="4">Invoices Service Unavailable</H3>
            <Text textStyle="body2" maxW="392px" mb="9" color="text.secondary" textAlign="center">
                The invoices service is currently unavailable for your project.
                This service may not be enabled for your account yet.
                Make request to enable it.
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
                <Button onClick={openFeedbackModal('invoices-request')} size="md">
                    Request
                </Button>
            </Flex>
        </Overlay>
    );
};
