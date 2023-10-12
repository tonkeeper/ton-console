import { FunctionComponent, useCallback, useMemo } from 'react';
import { CRYPTO_CURRENCY, H2, H4, Overlay } from 'src/shared';
import { Box, Button, Divider, Flex, Skeleton, useDisclosure } from '@chakra-ui/react';
import {
    BillingHistoryTable,
    billingStore,
    subscriptionsStore,
    SubscriptionsTable
} from 'src/widgets';
import { balanceStore, CurrencyRate, RefillModal } from 'src/entities';
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
                    <H2 mb="1" display="flex" alignItems="center" gap="2">
                        {balanceStore.portfolio$.isLoading ? (
                            <Skeleton w="100px" h="6" />
                        ) : (
                            balanceStore.balances[0]?.stringAmount + ' TON'
                        )}
                    </H2>
                    <CurrencyRate
                        textStyle="body2"
                        color="text.secondary"
                        mb="5"
                        skeletonWidth="70px"
                        currency={CRYPTO_CURRENCY.TON}
                        leftSign={balanceStore.balances[0]?.amount.isZero() ? '' : '≈'}
                        amount={balanceStore.balances[0]?.amount}
                        amountLoading={balanceStore.portfolio$.isLoading}
                        contentUnderSkeleton="&nbsp;USD"
                    />
                    <Flex gap="3">
                        <Button onClick={onOpen}>Refill</Button>
                        <Button
                            isLoading={refreshLoading}
                            onClick={onRefreshClick}
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
