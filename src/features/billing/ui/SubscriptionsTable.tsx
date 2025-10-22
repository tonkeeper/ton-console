import {
    Box,
    Center,
    Flex,
    Menu,
    MenuList,
    MenuItem,
    Skeleton,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    chakra
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { toDate, VerticalDotsIcon16, MenuButtonIcon } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { subscriptionsStore } from 'src/features/billing';
import { useNavigate } from 'react-router-dom';

interface SubscriptionsTableProps {
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    hasSubscriptions?: boolean;
}

const SubscriptionsTable: FunctionComponent<SubscriptionsTableProps> = ({
    isLoading = subscriptionsStore.subscriptionsLoading,
    hasEverLoaded = false,
    hasSubscriptions = subscriptionsStore.subscriptions.length > 0,
    ...props
}) => {
    const navigate = useNavigate();

    // First load - show Spinner (height of header + one row: 48px + 48px = 96px)
    if (!hasEverLoaded && isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    // No data and not loading - show Empty message (height of header + one row: 48px + 48px = 96px)
    if (!isLoading && !hasSubscriptions) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No plans yet
            </Box>
        );
    }

    // Table with data or skeleton
    return (
        <TableContainer
            minH="100px"
            border="1px"
            borderColor="background.contentTint"
            borderRadius="sm"
            {...props}
        >
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Plan</Th>
                        <Th>Interval</Th>
                        <Th>Renews</Th>
                        <Th w="100%" textAlign="right">
                            <chakra.span pr="34px">Price</chakra.span>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading && hasEverLoaded
                        ? // Show skeleton while loading if data has been loaded before
                          Array.from({ length: 1 }).map((_, index) => (
                              <Tr key={index}>
                                  <Td>
                                      <Skeleton h="4" />
                                  </Td>
                                  <Td>
                                      <Skeleton h="4" />
                                  </Td>
                                  <Td>
                                      <Skeleton h="4" />
                                  </Td>
                                  <Td>
                                      <Skeleton h="4" />
                                  </Td>
                              </Tr>
                          ))
                        : // Show real data
                          subscriptionsStore.subscriptions.map(subscription => (
                              <Tr key={subscription.id}>
                                  <Td>{subscription.plan}</Td>
                                  <Td>{subscription.interval}</Td>
                                  <Td>{toDate(subscription.renewsDate)}</Td>
                                  <Td>
                                      <Flex align="center" justify="flex-end" gap="4">
                                          <chakra.span>
                                              {subscription.price.stringCurrencyAmount}
                                          </chakra.span>
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
                                  </Td>
                              </Tr>
                          ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default observer(SubscriptionsTable);
