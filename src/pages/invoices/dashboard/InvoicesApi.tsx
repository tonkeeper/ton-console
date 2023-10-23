import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Code,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    UnorderedList
} from '@chakra-ui/react';
import { CopyPad, DocsLink } from 'src/shared';
import { invoicesAppStore, INVOICES_LINKS } from 'src/features';
import { observer } from 'mobx-react-lite';

const InvoicesApi: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <Tabs mb="4">
                <TabList w="auto" mx="-6" pl="6">
                    <Tab>Create Invoice</Tab>
                    <Tab>GET Invoice</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Text textStyle="body2" mb="5" color="text.secondary">
                            Creating an 1 TON invoice with life time of 30 minutes and description
                            &quot;Example description&quot; with API using curl:
                        </Text>
                        <CopyPad
                            isLoading={!invoicesAppStore.appToken$.isResolved}
                            whiteSpace="pre-wrap"
                            text={`curl -X POST 
    https://tonconsole.com/api/v1/services/invoices/invoice
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
                                    <Code>amount</Code> is an amount in nanoTONS (10^-9 TON) to pay
                                    to the invoice
                                </ListItem>
                                <ListItem pl="1">
                                    <Code>life_time</Code> is the duration of the invoice validity
                                    in seconds
                                </ListItem>
                                <ListItem pl="1">
                                    <Code>description (optional)</Code> any description of the
                                    invoice, not visible for users
                                </ListItem>
                            </UnorderedList>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Text textStyle="body2" mb="5" color="text.secondary">
                            Get invoice information by its id with API using curl:
                        </Text>
                        <CopyPad
                            isLoading={!invoicesAppStore.appToken$.isResolved}
                            whiteSpace="pre-wrap"
                            text={`curl GET 
    https://tonconsole.com/api/v1/services/invoices/invoice?id=<INVOICE_ID>
    -H 'Content-Type: application/json'
    -H 'Authorization: Bearer ${invoicesAppStore.appToken$.value}'`}
                            iconAlign="start"
                            mb="3"
                        />
                        <Box textStyle="body2" mb="4" color="text.secondary">
                            <Box mb="1">Where query parameters are:</Box>
                            <UnorderedList listStyleType={'"-"'} spacing="1">
                                <ListItem pl="1">
                                    <Code>id</Code> is an id of the required invoice to the invoice
                                </ListItem>
                            </UnorderedList>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <DocsLink href={INVOICES_LINKS.USAGE} mb="1" />
        </Box>
    );
};

export default observer(InvoicesApi);
