import {
    Box,
    Center,
    Flex,
    Menu,
    MenuList,
    MenuItem,
    Skeleton,
    Spinner,
    Text
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { toDate, VerticalDotsIcon16, MenuButtonIcon } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { SubscriptionsStore } from 'src/features/billing';
import { useNavigate } from 'react-router-dom';

interface SubscriptionListProps {
    subscriptionsStore: SubscriptionsStore;
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    hasSubscriptions?: boolean;
}

const SubscriptionList: FunctionComponent<SubscriptionListProps> = ({
    subscriptionsStore,
    isLoading = subscriptionsStore.subscriptionsLoading,
    hasEverLoaded = false,
    hasSubscriptions = subscriptionsStore.subscriptions.length > 0,
    ...props
}) => {
    const navigate = useNavigate();

    // First load - show Spinner
    if (!hasEverLoaded && isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

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
            {isLoading && hasEverLoaded
                ? // Show skeleton while loading if data has been loaded before
                  Array.from({ length: 1 }).map((_, index) => (
                      <Flex
                          key={index}
                          align="center"
                          justify="space-between"
                          py="2"
                          gap="4"
                      >
                          <Flex flexDirection="column" gap="1" flex="1">
                              <Skeleton h="5" w="150px" />
                              <Skeleton h="4" w="200px" />
                          </Flex>
                          <Flex align="center" gap="4" flexShrink={0}>
                              <Skeleton h="5" w="80px" />
                              <Box w="24px" />
                          </Flex>
                      </Flex>
                  ))
                : // Show real data
                  subscriptionsStore.subscriptions.map(subscription => (
                      <Flex
                          key={subscription.id}
                          align="center"
                          justify="space-between"
                          py="2"
                          gap="4"
                      >
                          <Flex flexDirection="column" gap="1" flex="1">
                              <Text fontSize="md" fontWeight="semibold">
                                  {subscription.plan}
                              </Text>
                              <Text fontSize="sm" color="text.secondary">
                                  {subscription.interval} · { subscription.renewsDate && `Renews ${toDate(subscription.renewsDate)}`}
                              </Text>
                          </Flex>
                          <Flex align="center" gap="4" flexShrink={0}>
                              <Text fontSize="md" fontWeight="semibold">
                                  {subscription.price.stringCurrencyAmount}
                              </Text>
                              <Menu placement="bottom-end">
                                  <MenuButtonIcon
                                      aria-label="options"
                                      icon={<VerticalDotsIcon16 />}
                                  />
                                  <MenuList w="132px">
                                      <MenuItem
                                          onClick={() => navigate('/tonapi/pricing')}
                                      >
                                          <Text textStyle="label2">Change plan</Text>
                                      </MenuItem>
                                  </MenuList>
                              </Menu>
                          </Flex>
                      </Flex>
                  ))}
        </Box>
    );
};

export default observer(SubscriptionList);
