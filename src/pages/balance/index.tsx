import { FC, useEffect } from 'react';
import { Overlay } from 'src/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useBalanceQuery } from 'src/features/balance';
import BalanceBlock from './BalanceBlock';
import SubscriptionsBlock from './SubscriptionsBlock';
import BillingBlock from './BillingBlock';
import { Flex } from '@chakra-ui/react';

const BalancePage: FC = () => {
    const queryClient = useQueryClient();
    const { data: balance } = useBalanceQuery();

    // When balance changes, refetch billing history and subscriptions to keep them in sync
    useEffect(() => {
        queryClient.refetchQueries({
            queryKey: ['billing-history']
        });
        queryClient.refetchQueries({
            queryKey: ['rest-api-selected-tier']
        });
        queryClient.refetchQueries({
            queryKey: ['liteproxy-selected-tier']
        });
    }, [balance?.total, queryClient]);

    return (
        <>
            <Flex align="stretch" wrap="wrap" gap={4} mb={4}>
                <BalanceBlock />
                <SubscriptionsBlock />
            </Flex>
            <Overlay h="fit-content" p="0" display="flex" flexDirection="column">
                <BillingBlock />
            </Overlay>
        </>
    );
};

export default BalancePage;
