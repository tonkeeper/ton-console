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

            if (!invoicesTableStore.invoices$.isResolved) {
                body = (
                    <EmptyTable>
                        <Spinner />
                    </EmptyTable>
                );
            } else if (!invoicesTableStore.invoices$.value.length) {
                body = (
                    <EmptyTable>
                        {!invoicesTableStore.isFilterEmpty
                            ? 'Nothing found. Try changing your search inputs.'
                            : 'This is where you’ll see your invoices'}
                    </EmptyTable>
                );
            }

            return (
                <Box {...rest} ref={ref}>
                    <Table
                        sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
                        pos="sticky"
                        top="0"
                        w="100%"
                        variant="withBottomBorder"
                    >
                        <Thead>
                            <Tr sx={{ th: { px: 2, zIndex: 2 } }}>
                                <Th
                                    pos="sticky"
                                    top="0"
                                    minW="100px"
                                    bg="background.contentTint"
                                    borderTop="1px"
                                    borderTopColor="background.contentTint"
                                    borderLeft="1px"
                                    borderLeftColor="background.contentTint"
                                    borderTopLeftRadius="sm"
                                    boxSizing="content-box"
                                >
                                    <InvoicesTableColumnLabel pl="32px" column="id">
                                        ID
                                    </InvoicesTableColumnLabel>
                                </Th>
                                <Th
                                    pos="sticky"
                                    top="0"
                                    minW="320px"
                                    bg="background.contentTint"
                                    boxSizing="content-box"
                                >
                                    <InvoicesTableColumnLabel column="status">
                                        Status
                                    </InvoicesTableColumnLabel>
                                </Th>
                                <Th
                                    pos="sticky"
                                    top="0"
                                    minW="180px"
                                    bg="background.contentTint"
                                    boxSizing="content-box"
                                >
                                    <InvoicesTableColumnLabel column="creation-date">
                                        Creation date
                                    </InvoicesTableColumnLabel>
                                </Th>
                                <Th
                                    pos="sticky"
                                    top="0"
                                    minW="240px"
                                    bg="background.contentTint"
                                    boxSizing="content-box"
                                >
                                    <InvoicesTableColumnLabel column="description">
                                        Invoice description
                                    </InvoicesTableColumnLabel>
                                </Th>
                                <Th
                                    pos="sticky"
                                    top="0"
                                    w="100%"
                                    textAlign="right"
                                    bg="background.contentTint"
                                    borderTop="1px"
                                    borderTopColor="background.contentTint"
                                    borderRight="1px"
                                    borderRightColor="background.contentTint"
                                    borderTopRightRadius="sm"
                                    boxSizing="content-box"
                                >
                                    <InvoicesTableColumnLabel column="amount">
                                        Amount
                                    </InvoicesTableColumnLabel>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>{body}</Tbody>
                    </Table>
                </Box>
            );
        }
    )
);
