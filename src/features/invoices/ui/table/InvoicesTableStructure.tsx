import {
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    forwardRef,
    Box,
    Spinner,
    Td,
    Center
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, PropsWithChildren, useContext } from 'react';
import InvoicesTableColumnLabel from './InvoicesTableSortButton';
import { invoicesTableStore } from 'src/features';
import { InvoicesTableContext } from 'src/features/invoices/ui/table/invoices-table-context';
import { observer } from 'mobx-react-lite';

const EmptyTable: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { rawHeight } = useContext(InvoicesTableContext);
    return (
        <Tr h={rawHeight} maxH={rawHeight}>
            <Td
                h="192px"
                border="1px"
                borderColor="background.contentTint"
                borderTop="0"
                colSpan={5}
            >
                <Center textStyle="body2" color="text.secondary" fontFamily="body">
                    {children}
                </Center>
            </Td>
        </Tr>
    );
};

export const InvoicesTableStructure = observer(
    forwardRef<PropsWithChildren<ComponentProps<typeof Box>>, typeof Box>(
        ({ children, ...rest }, ref) => {
            let body = children;
            const { rawHeight } = useContext(InvoicesTableContext);

            if (!invoicesTableStore.invoices$.isResolved) {
                body = (
                    <EmptyTable>
                        <Spinner />
                    </EmptyTable>
                );
            } else if (!invoicesTableStore.invoices$.value.length) {
                body = (
                    <EmptyTable>
                        {!invoicesTableStore.isFilterEmpty ? 'No matches' : 'No invoices yet'}
                    </EmptyTable>
                );
            }

            return (
                <Table
                    ref={ref}
                    sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
                    w="100%"
                    variant="withBottomBorder"
                    {...rest}
                >
                    <Thead>
                        <Tr
                            sx={{ th: { px: 2, zIndex: 2 } }}
                            pos="sticky"
                            zIndex="4"
                            top="0"
                            left="0"
                            w="100%"
                            h={rawHeight}
                        >
                            <Th
                                minW="100px"
                                bg="background.contentTint"
                                borderTop="1px"
                                borderTopColor="background.contentTint"
                                borderLeft="1px"
                                borderLeftColor="background.contentTint"
                                borderTopLeftRadius="sm"
                                boxSizing="content-box"
                            >
                                ID
                            </Th>
                            <Th minW="320px" bg="background.contentTint" boxSizing="content-box">
                                <InvoicesTableColumnLabel column="status">
                                    Status
                                </InvoicesTableColumnLabel>
                            </Th>
                            <Th minW="160px" bg="background.contentTint" boxSizing="content-box">
                                <InvoicesTableColumnLabel column="amount">
                                    Amount
                                </InvoicesTableColumnLabel>
                            </Th>
                            <Th minW="180px" bg="background.contentTint" boxSizing="content-box">
                                <InvoicesTableColumnLabel column="creation-date">
                                    Creation Date
                                </InvoicesTableColumnLabel>
                            </Th>
                            <Th
                                w="100%"
                                bg="background.contentTint"
                                borderTop="1px"
                                borderTopColor="background.contentTint"
                                borderRight="1px"
                                borderRightColor="background.contentTint"
                                borderTopRightRadius="sm"
                                boxSizing="content-box"
                            >
                                <InvoicesTableColumnLabel column="description">
                                    Description
                                </InvoicesTableColumnLabel>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody pos="relative">{body}</Tbody>
                </Table>
            );
        }
    )
);
