import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    chakra,
    Flex,
    Text,
    MenuList,
    MenuItem,
    Menu,
    Center,
    Spinner
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { toDate, VerticalDotsIcon16, MenuButtonIcon } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { subscriptionsStore } from 'src/widgets';
import { useNavigate } from 'react-router-dom';

const SubscriptionsTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    const navigate = useNavigate();

    if (subscriptionsStore.subscriptionsLoading) {
        return (
            <Center h="100px">
                <Spinner />
            </Center>
        );
    }

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
                    {subscriptionsStore.subscriptions.map(subscription => (
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
                                            <MenuItem onClick={() => navigate('/tonapi/pricing')}>
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
