import {
    Box,
    Center,
    Flex,
    Menu,
    MenuList,
    MenuItem,
    Skeleton,
    Spinner,
    Text,
    Divider
} from '@chakra-ui/react';
import { FC } from 'react';
import { toDate, VerticalDotsIcon16, MenuButtonIcon } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { SubscriptionsStore } from 'src/features/billing';
import { useNavigate } from 'react-router-dom';
import { Subscription } from '../model/interfaces/subscription';

interface SubscriptionListProps {
    subscriptionsStore: SubscriptionsStore;
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    hasSubscriptions?: boolean;
}

interface SubscriptionListItemProps {
    subscription?: Subscription;
}

const SubscriptionListItem: FC<SubscriptionListItemProps> = ({ subscription }) => {
    const navigate = useNavigate();

    return (
        <Flex justify="space-between" py="1" gap="4">
            <Flex flexDirection="column" flex="1">
                {subscription ? (
                    <>
                        <Text fontSize="sm" fontWeight="semibold">
                            {subscription.plan}
                        </Text>
                        <Text fontSize="sm" color="text.secondary">
                            {subscription.interval}
                            {subscription.renewsDate && ` · Renews ${toDate(subscription.renewsDate)}`}
                        </Text>
                    </>
                ) : (
                    <>
                        <Skeleton h="5" w="150px" />
                        <Skeleton h="4" w="200px" />
                    </>
                )}
            </Flex>
            <Box gap="1">
                {subscription ? (
                    <Flex align="center">
                        <Text fontSize="md" fontWeight="semibold">
                            {subscription.price.stringCurrencyAmount}
                        </Text>
                        <Menu placement="bottom-end">
                            <MenuButtonIcon
                                aria-label="options"
                                icon={<VerticalDotsIcon16 />}
                                ml="2"
                            />
                            <MenuList w="132px">
                                <MenuItem onClick={() => navigate('/tonapi/pricing')}>
                                    <Text textStyle="label2">Change plan</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                ) : (
                    <>
                        <Skeleton h="5" w="80px" />
                        <Box w="24px" />
                    </>
                )}
            </Box>
        </Flex>
    );
};

const SubscriptionList: FC<SubscriptionListProps> = ({
    subscriptionsStore,
    ...props
}) => {
    const isLoading = subscriptionsStore.subscriptionsLoading;

    // First load - show Spinner
    if (isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    const { liteproxy, restApi } = subscriptionsStore.subscriptions;
    const hasSubscriptions = Boolean(liteproxy || restApi);

    // No data and not loading - show Empty message
    if (!isLoading && !hasSubscriptions) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No active plans yet
            </Box>
        );
    }

    // Card list with data or skeleton
    return (
        <Box minH="100px" {...props}>
            <SubscriptionListItem subscription={!isLoading && restApi ? restApi : undefined} />
            <Divider />
            <SubscriptionListItem subscription={!isLoading && liteproxy ? liteproxy : undefined} />
        </Box>
    );
};

export default observer(SubscriptionList);
