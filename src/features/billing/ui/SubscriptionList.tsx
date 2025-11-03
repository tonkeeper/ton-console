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
import { useNavigate } from 'react-router-dom';
import { Subscription } from '../model/interfaces/subscription';

interface SubscriptionListProps {
    subscriptions?: { restApi: Subscription | null; liteproxy: Subscription | null };
    isLoading?: boolean;
}

interface SubscriptionListItemProps {
    subscription?: Subscription;
}

const intervalToText = (interval: string) => {
    switch (interval) {
        case 'month':
            return 'Monthly';
        case 'pay_as_you_go':
            return 'Pay as you go';
        default:
            return interval;
    }
};

const SubscriptionListItem: FC<SubscriptionListItemProps> = ({ subscription }) => {
    const navigate = useNavigate();

    return (
        <Flex justify="space-between" gap="4" py="1">
            <Flex direction="column" flex="1">
                {subscription ? (
                    <>
                        <Text fontSize="sm" fontWeight="semibold">
                            {subscription.plan}
                        </Text>
                        <Text color="text.secondary" fontSize="sm">
                            {intervalToText(subscription.interval)}
                            {subscription.renewsDate &&
                                ` · Renews ${toDate(subscription.renewsDate)}`}
                        </Text>
                    </>
                ) : (
                    <>
                        <Skeleton w="150px" h="5" />
                        <Skeleton w="200px" h="4" />
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
                        <Skeleton w="80px" h="5" />
                        <Box w="24px" />
                    </>
                )}
            </Box>
        </Flex>
    );
};

const SubscriptionList: FC<SubscriptionListProps> = ({
    subscriptions,
    isLoading = false,
    ...props
}) => {
    // First load - show Spinner
    if (isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    const { restApi, liteproxy } = subscriptions || { restApi: null, liteproxy: null };
    const hasSubscriptions = Boolean(liteproxy || restApi);

    // No data and not loading - show Empty message
    if (!isLoading && !hasSubscriptions) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No active plans yet
            </Box>
        );
    }

    // Check if both subscriptions exist (to show divider)
    const shouldShowDivider = !isLoading && restApi && liteproxy;

    // Card list with data or skeleton
    return (
        <Box minH="100px" {...props}>
            {restApi && <SubscriptionListItem subscription={restApi} />}
            {shouldShowDivider && <Divider />}
            {liteproxy && <SubscriptionListItem subscription={liteproxy} />}
        </Box>
    );
};

export default SubscriptionList;
