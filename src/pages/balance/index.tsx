import { FunctionComponent } from 'react';
import { H2, H4, Overlay } from 'src/shared';
import { Box, Button, Divider, Text, useDisclosure } from '@chakra-ui/react';
import { RefillModal, SubscriptionsTable, TransactionsHistoryTable } from 'src/features';

const BalancePage: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <>
            <Overlay h="fit-content" p="0">
                <Box mb="6" pt="5" px="6">
                    <H2 mb="1">0 TON</H2>
                    <Text textStyle="body2" mb="5" color="text.secondary">
                        0 USD
                    </Text>
                    <Button onClick={onOpen} size="lg">
                        Refill
                    </Button>
                </Box>
                <Divider />
                <Box mb="6" pt="5" px="6">
                    <H4 mb="5">Subscriptions and Plans</H4>
                    <SubscriptionsTable />
                </Box>
                <Divider />
                <Box pt="5" pb="6" px="6">
                    <H4 mb="5">Transactions History</H4>
                    <TransactionsHistoryTable />
                </Box>
            </Overlay>
            <RefillModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default BalancePage;
