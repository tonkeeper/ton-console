import { Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { explorer, shortAddress, toDateTime } from 'src/shared';
import { balanceStore } from 'src/entities';
import { PaymentDescription } from './PaymentDescription';
import { observer } from 'mobx-react-lite';

const TransactionsHistoryTable: FunctionComponent<
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
                    {balanceStore.billingHistory.value.map(historyItem => (
                        <Tr key={historyItem.id}>
                            <Td>{toDateTime(historyItem.date)}</Td>

                            {historyItem.action === 'payment' ? (
                                <>
                                    <Td>
                                        <PaymentDescription description={historyItem.description} />
                                    </Td>
                                    <Td textAlign="right">
                                        -{historyItem.amount.stringCurrencyAmount}
                                    </Td>
                                </>
                            ) : (
                                <>
                                    <Td>
                                        Refill from{' '}
                                        <Link
                                            color="text.accent"
                                            href={explorer.generateLinkToAddress(
                                                historyItem.fromAddress
                                            )}
                                            isExternal
                                        >
                                            {shortAddress(historyItem.fromAddress)}
                                        </Link>
                                    </Td>
                                    <Td color="accent.green" textAlign="right">
                                        +{historyItem.amount.stringCurrencyAmount}
                                    </Td>
                                </>
                            )}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default observer(TransactionsHistoryTable);
