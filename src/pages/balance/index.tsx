import { FunctionComponent, useCallback, useMemo } from 'react';
import { H2, H4, Overlay } from 'src/shared';
import { Box, Button, Divider, Flex, Skeleton, useDisclosure, chakra } from '@chakra-ui/react';
import {
    SubscriptionsTable,
    BillingHistoryTable,
    subscriptionsStore,
    billingStore
} from 'src/widgets';
import { balanceStore, RefillModal } from 'src/entities';
import { observer } from 'mobx-react-lite';

const BalancePage: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const onRefreshClick = useCallback(() => {
        subscriptionsStore.fetchSubscriptions();
        billingStore.fetchBillingHistory();
    }, []);

    const refreshLoading = useMemo(() => {
        return subscriptionsStore.subscriptionsLoading || billingStore.billingHistoryLoading;
    }, [billingStore.billingHistoryLoading, subscriptionsStore.subscriptionsLoading]);

    return (
        <>
            <Overlay h="fit-content" p="0">
                <Box pt="5" pb="6" px="6">
                    <H2 mb="5" display="flex" alignItems="center" gap="2">
                        {balanceStore.portfolio$.isLoading ? (
                            <Skeleton w="60px" h="6" />
                        ) : (
                            <chakra.span minW="60px" textAlign="center">
                                {balanceStore.balances[0]?.stringAmount}
                            </chakra.span>
                        )}{' '}
                        TON
                    </H2>
                    <Flex gap="3">
                        <Button onClick={onOpen} size="lg">
                            Refill
                        </Button>
                        <Button
                            isLoading={refreshLoading}
                            onClick={onRefreshClick}
                            size="lg"
                            variant="secondary"
                        >
                            Refresh
                        </Button>
                    </Flex>
                </Box>
                {!!subscriptionsStore.subscriptions.length && (
                    <>
                        <Divider />
                        <Box pt="5" pb="6" px="6">
                            <H4 mb="5">Subscriptions and Plans</H4>
                            <SubscriptionsTable />
                        </Box>
                    </>
                )}

                {!!billingStore.billingHistory.length && (
                    <>
                        <Divider />
                        <Box pt="5" pb="6" px="6">
                            <H4 mb="5">Transactions History</H4>
                            <BillingHistoryTable />
                        </Box>
                    </>
                )}
            </Overlay>
            <RefillModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(BalancePage);
