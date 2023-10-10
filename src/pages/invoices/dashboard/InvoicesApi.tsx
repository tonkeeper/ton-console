import { ComponentProps, FunctionComponent } from 'react';
import { Box, Code, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { CopyPad, DocsLink } from 'src/shared';
import { invoicesAppStore, INVOICES_LINKS } from 'src/features';

export const InvoicesApi: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <Text textStyle="label1" mb="1">
                Create an invoice with API
            </Text>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Creating an 1 TON invoice with life time of 30 minutes and description &quot;Example
                description&quot; with API using curl:
            </Text>
            <CopyPad
                isLoading={!invoicesAppStore.appToken$.isResolved}
                whiteSpace="pre-wrap"
                text={`curl -X POST 
    https://tonconsole.com/api/v1/invoices/invoice
    -H 'Content-Type: application/json'
    -H 'Authorization: Bearer ${invoicesAppStore.appToken$.value}'
    -d 
    '{"amount": "1000000000", "life_time": "1800", "description": "Example description"}'`}
                iconAlign="start"
                mb="3"
            />
            <Box textStyle="body2" mb="4" color="text.secondary">
                <Box mb="1">Where body have properties:</Box>
                <UnorderedList listStyleType={'"-"'} spacing="1">
                    <ListItem pl="1">
                        <Code>amount</Code> is an amount in nanoTONS (10^-9 TON) to pay to the
                        invoice
                    </ListItem>
                    <ListItem pl="1">
                        <Code>life_time</Code> is the duration of the invoice validity in seconds
                    </ListItem>
                    <ListItem pl="1">
                        <Code>description (optional)</Code> any description of the invoice, not
                        visible for users
                    </ListItem>
                </UnorderedList>
            </Box>
            <DocsLink href={INVOICES_LINKS.USAGE} mb="1" />
        </Box>
    );
};
