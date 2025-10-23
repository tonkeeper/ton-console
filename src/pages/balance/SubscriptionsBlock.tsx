import { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { useLocalObservable } from 'mobx-react-lite';
import { SubscriptionsTable, SubscriptionsStore } from 'src/features/billing';

const SubscriptionsBlock: FC = () => {
    const subscriptionsStore = useLocalObservable(() => new SubscriptionsStore());
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const hasSubscriptions = subscriptionsStore.subscriptions.length > 0;
    const isLoading = subscriptionsStore.subscriptionsLoading;

    useEffect(() => {
        if (!isLoading && hasSubscriptions) {
            setHasEverLoaded(true);
        }
    }, [isLoading, hasSubscriptions]);

    return (
        <Box px="6" py="5">
            <H4 mb="5">Plans</H4>
            <SubscriptionsTable
                subscriptionsStore={subscriptionsStore}
                isLoading={isLoading}
                hasEverLoaded={hasEverLoaded}
                hasSubscriptions={hasSubscriptions}
            />
        </Box>
    );
};

export default observer(SubscriptionsBlock);
