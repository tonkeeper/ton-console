import { FC } from 'react';
import { Overlay, useLocalObservableWithDestroy } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { BillingStore } from 'src/features/billing';
import BalanceBlock from './BalanceBlock';
import SubscriptionsBlock from './SubscriptionsBlock';
import BillingBlock from './BillingBlock';
import { Flex } from '@chakra-ui/react';

const BalancePage: FC = () => {
    const billingStore = useLocalObservableWithDestroy(() => new BillingStore());

    return (
        <>
            <Flex align="stretch" wrap="wrap" gap={4} mb={4}>
                <BalanceBlock />
                <SubscriptionsBlock />
            </Flex>
            <Overlay h="fit-content" p="0" display="flex" flexDirection="column">
                <BillingBlock billingStore={billingStore} />
            </Overlay>
        </>
    );
};

export default observer(BalancePage);
