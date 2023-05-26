import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex, Skeleton, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { formatNumber, Span } from 'src/shared';
import { invoicesAppStore } from 'src/features';

const InvoicesStats: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const isResolved = invoicesAppStore.statistics$.isResolved;
    const stats = invoicesAppStore.statistics$.value!;

    return (
        <Box {...props}>
            <Text textStyle="label1" mb="1">
                Statistics
            </Text>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Description
            </Text>
            <Box textStyle="body2" maxW="320px">
                <Flex justify="space-between" mb="2">
                    <Span color="text.secondary">Total invoices</Span>
                    {isResolved ? formatNumber(stats.totalInvoices) : <Skeleton w="100px" h="3" />}
                </Flex>
                <Flex justify="space-between" mb="2">
                    <Span color="text.secondary">Earned total</Span>
                    {isResolved ? (
                        stats.earnedTotal.stringCurrencyAmount
                    ) : (
                        <Skeleton w="100px" h="3" />
                    )}
                </Flex>
                <Flex justify="space-between" mb="2">
                    <Span color="text.secondary">Earned last 7 days</Span>
                    {isResolved ? (
                        stats.earnedLastWeek.stringCurrencyAmount
                    ) : (
                        <Skeleton w="100px" h="3" />
                    )}
                </Flex>
                <Flex justify="space-between" mb="2">
                    <Span color="text.secondary">Invoices in progress</Span>
                    {isResolved ? (
                        formatNumber(stats.invoicesInProgress)
                    ) : (
                        <Skeleton w="100px" h="3" />
                    )}
                </Flex>
                <Flex justify="space-between">
                    <Span color="text.secondary">Awaiting for payment amount</Span>
                    {isResolved ? (
                        stats.awaitingForPaymentAmount.stringCurrencyAmount
                    ) : (
                        <Skeleton w="100px" h="3" />
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default observer(InvoicesStats);
