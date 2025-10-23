import { FC, useEffect } from 'react';
import { Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { useLocalObservable } from 'mobx-react-lite';
import { BillingStore } from 'src/features/billing';
import BalanceBlock from './BalanceBlock';
import SubscriptionsBlock from './SubscriptionsBlock';
import BillingBlock from './BillingBlock';
import { Divider } from '@chakra-ui/react';

const BalancePage: FC = () => {
    const billingStore = useLocalObservable(() => new BillingStore());

    useEffect(() => {
        return () => billingStore.clearState();
    }, [billingStore]);

    return (
        <>
            <BalanceBlock />
            <Overlay h="fit-content" p="0" display="flex" flexDirection="column">
                <SubscriptionsBlock />
                <Divider />
                <BillingBlock billingStore={billingStore} />
            </Overlay>
        </>
    );
};

export default observer(BalancePage);
