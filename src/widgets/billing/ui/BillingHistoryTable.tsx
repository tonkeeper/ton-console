import {
    Center,
    Link,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { explorer, shortAddress, toDateTime } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { billingStore } from 'src/widgets/billing';

const BillingHistoryTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    if (billingStore.billingHistoryLoading) {
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
                        <Th>History</Th>
                        <Th>Action</Th>
                        <Th w="100%" textAlign="right">
                            Amount
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {billingStore.billingHistory.map(historyItem => (
                        <Tr key={historyItem.id}>
                            <Td>{toDateTime(historyItem.date)}</Td>

                            {historyItem.action === 'payment' ? (
                                <>
                                    <Td>{historyItem.name}</Td>
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

export default observer(BillingHistoryTable);
