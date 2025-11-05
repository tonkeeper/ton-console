import { FC } from 'react';
import {
    Box,
    BoxProps,
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
import { CopyPad, CardLink } from 'src/shared';
import { InvoicesApp, INVOICES_LINKS } from 'src/features';

interface InvoicesApiProps extends BoxProps {
    app?: InvoicesApp | null;
}

const InvoicesApi: FC<InvoicesApiProps> = ({ app, ...props }) => {
    if (!app) {
        return null;
    }

    return (
        <Box {...props}>
            <Tabs mb="4" isLazy={true}>
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
                            whiteSpace="pre-wrap"
                            text={`curl -X POST https://tonconsole.com/api/v1/services/invoices/invoice \\
    -H 'Content-Type: application/json' \\
    -H 'Authorization: Bearer <YOUR_TOKEN>' \\
    -d '{"amount": "1000000", "life_time": 1800, "description": "Example description", "currency": "TON"}'`}
                            iconAlign="start"
                            mb="3"
                        />
                        <Box textStyle="body2" mb="4" color="text.secondary">
                            <Box mb="1">Where body have properties:</Box>
                            <UnorderedList listStyleType={'"-"'} spacing="1">
                                <ListItem pl="1">
                                    <Code>amount</Code> is an amount in nanoTONs (10^-9) for TON and
                                    microUSDTs (10^-6) for USDT to pay to the invoice
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
                            whiteSpace="pre-wrap"
                            text={`curl -X GET https://tonconsole.com/api/v1/services/invoices/<INVOICE_ID> \\
    -H 'Content-Type: application/json' \\
    -H 'Authorization: Bearer <YOUR_TOKEN>'`}
                            iconAlign="start"
                            mb="3"
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <CardLink href={INVOICES_LINKS.USAGE} mb="1" />
        </Box>
    );
};

export default InvoicesApi;
