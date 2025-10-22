import { FC, useEffect } from 'react';
import { Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { billingStore } from 'src/features/billing';
import BalanceBlock from './BalanceBlock';
import SubscriptionsBlock from './SubscriptionsBlock';
import BillingBlock from './BillingBlock';
import { Divider } from '@chakra-ui/react';

const BalancePage: FC = () => {
    useEffect(() => {
        billingStore.clear();
        billingStore.loadFirstPage();
        return billingStore.clear;
    }, []);

    return (
        <>
            <BalanceBlock />
            <Overlay h="fit-content" p="0" display="flex" flexDirection="column">
                <SubscriptionsBlock />
                <Divider />
                <BillingBlock />
            </Overlay>
        </>
    );
};

export default observer(BalancePage);
