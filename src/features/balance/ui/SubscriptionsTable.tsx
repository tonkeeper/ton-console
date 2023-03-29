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
import { CancelIcon24, VerticalDotsIcon16 } from 'src/shared';

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
                    <Tr>
                        <Td>TON API Pro</Td>
                        <Td>Monthly</Td>
                        <Td>17 Jun</Td>
                        <Td>
                            <Flex align="center" justify="flex-end" gap="4">
                                <chakra.span>160 TON</chakra.span>
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
                    <Tr>
                        <Td>TON API Pro</Td>
                        <Td>Monthly</Td>
                        <Td>17 Jun</Td>
                        <Td>
                            <Flex align="center" justify="flex-end" gap="4">
                                <chakra.span>160 TON</chakra.span>
                                <VerticalDotsIcon16 />
                            </Flex>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>TON API Pro</Td>
                        <Td>Monthly</Td>
                        <Td>17 Jun</Td>
                        <Td>
                            <Flex align="center" justify="flex-end" gap="4">
                                <chakra.span>160 TON</chakra.span>
                                <VerticalDotsIcon16 />
                            </Flex>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};
