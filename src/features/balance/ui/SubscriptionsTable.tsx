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
    MenuButton,
    Text,
    MenuList,
    MenuItem,
    Menu
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { projectsStore } from 'src/entities';
import { CancelIcon24, toDate, VerticalDotsIcon16 } from 'src/shared';
import { SubscriptionDetails } from './SubscriptionDetails';

export const SubscriptionsTable: FunctionComponent<
    ComponentProps<typeof TableContainer>
> = props => {
    return (
        <TableContainer
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
                    {projectsStore.selectedProject?.subscriptions.map(subscription => (
                        <Tr key={subscription.id}>
                            <Td>
                                <SubscriptionDetails details={subscription.details} />
                            </Td>
                            <Td>{subscription.interval}</Td>
                            <Td>{toDate(subscription.renewsDate)}</Td>
                            <Td>
                                <Flex align="center" justify="flex-end" gap="4">
                                    <chakra.span>
                                        {subscription.price.stringCurrencyAmount}
                                    </chakra.span>
                                    <Menu placement="bottom-end">
                                        <MenuButton>
                                            <VerticalDotsIcon16 />
                                        </MenuButton>
                                        <MenuList w="132px">
                                            <MenuItem>
                                                <CancelIcon24 mr="2" />
                                                <Text textStyle="label2">Cancel</Text>
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
