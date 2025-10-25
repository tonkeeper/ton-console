import { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Overlay, useLocalObservableWithDestroy } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { SubscriptionsStore, SubscriptionList } from 'src/features/billing';

const SubscriptionsBlock: FC = () => {
    const subscriptionsStore = useLocalObservableWithDestroy(() => new SubscriptionsStore());

    return (
        <Overlay height="auto" p="0" display="flex" flexDirection="column" flex="1" minW="330px">
            <Box px="6" py="5">
                <Text mb="2" fontSize="lg" fontWeight="semibold">
                    Active Plans
                </Text>
                <SubscriptionList subscriptionsStore={subscriptionsStore} />
            </Box>
        </Overlay>
    );
};

export default observer(SubscriptionsBlock);
