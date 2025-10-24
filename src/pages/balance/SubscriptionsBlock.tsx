import { FC, useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { useLocalObservable } from 'mobx-react-lite';
import { SubscriptionsStore, SubscriptionList } from 'src/features/billing';

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
        <Overlay height="auto" p="0" display="flex" flexDirection="column" flex="1" minW="330px">
            <Box px="6" py="5">
                <Text fontSize="lg" fontWeight="semibold" mb="2">Active Plans</Text>
                <SubscriptionList
                    subscriptionsStore={subscriptionsStore}
                    isLoading={isLoading}
                    hasEverLoaded={hasEverLoaded}
                    hasSubscriptions={hasSubscriptions}
                />
            </Box>
        </Overlay>
    );
};

export default observer(SubscriptionsBlock);
