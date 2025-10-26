import { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Overlay } from 'src/shared';
import { SubscriptionList, useSubscriptionsQuery } from 'src/features/billing';

const SubscriptionsBlock: FC = () => {
    const { data: subscriptions, isLoading } = useSubscriptionsQuery();

    return (
        <Overlay height="auto" p="0" display="flex" flexDirection="column" flex="1" minW="330px">
            <Box px="6" py="5">
                <Text mb="2" fontSize="lg" fontWeight="semibold">
                    Active Plans
                </Text>
                <SubscriptionList subscriptions={subscriptions} isLoading={isLoading} />
            </Box>
        </Overlay>
    );
};

export default SubscriptionsBlock;
