import { Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { explorer, shortAddress } from 'src/shared';

export const TransactionsHistoryTable: FunctionComponent<
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
                        <Th>History</Th>
                        <Th>Action</Th>
                        <Th w="100%" textAlign="right">
                            Amount
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>17 Jun, 14:44</Td>
                        <Td>Payment, TON API «Pro»</Td>
                        <Td textAlign="right">-160 TON</Td>
                    </Tr>
                    <Tr>
                        <Td>17 Jun, 14:44</Td>
                        <Td>
                            Refill from{' '}
                            <Link
                                color="text.accent"
                                href={explorer.generateLinkToAddress(
                                    'EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq'
                                )}
                                isExternal
                            >
                                {shortAddress('EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq')}
                            </Link>
                        </Td>
                        <Td textAlign="right">+330 TON</Td>
                    </Tr>
                    <Tr>
                        <Td>17 Jun, 14:44</Td>
                        <Td>Payment, TON API «Pro»</Td>
                        <Td textAlign="right">-160 TON</Td>
                    </Tr>
                    <Tr>
                        <Td>17 Jun, 14:44</Td>
                        <Td>
                            Refill from{' '}
                            <Link
                                color="text.accent"
                                href={explorer.generateLinkToAddress(
                                    'EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq'
                                )}
                                isExternal
                            >
                                {shortAddress('EQDoBhI8JERdpXHytsrGxCSvJwlPTejMSxMB8y_syxr3XgYq')}
                            </Link>
                        </Td>
                        <Td textAlign="right">+330 TON</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};
