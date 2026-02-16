import {
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Spinner,
    Td,
    Center,
    TableProps
} from '@chakra-ui/react';
import { FC, PropsWithChildren, useContext, useRef } from 'react';
import { DTOInvoiceFieldOrder } from 'src/shared/api';
import InvoicesTableSortButton from './InvoicesTableSortButton';
import { InvoicesTableContext } from 'src/features/invoices/ui/table/invoices-table-context';

const EmptyTable: FC<PropsWithChildren> = ({ children }) => {
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

interface InvoicesTableStructureProps extends PropsWithChildren<TableProps> {
    isLoading?: boolean;
    isEmpty?: boolean;
    currentSortColumn?: DTOInvoiceFieldOrder;
    sortDirection?: 'asc' | 'desc';
    onSetSortColumn: (column: DTOInvoiceFieldOrder) => void;
    onToggleSortDirection: () => void;
}

export const InvoicesTableStructure: FC<InvoicesTableStructureProps> = ({
    children,
    isLoading = false,
    isEmpty = false,
    currentSortColumn,
    sortDirection = 'desc',
    onSetSortColumn,
    onToggleSortDirection,
    ...rest
}) => {
    const { rawHeight } = useContext(InvoicesTableContext);

    let body = children;

    if (isLoading) {
        body = (
            <EmptyTable>
                <Spinner />
            </EmptyTable>
        );
    } else if (isEmpty) {
        body = (
            <EmptyTable>
                No invoices yet
            </EmptyTable>
        );
    }

    const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
    const tbodyWidth = tbodyRef.current?.clientWidth;

    return (
        <Table
            sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
            w="100%"
            variant="withBottomBorder"
            {...rest}
        >
            <Thead>
                <Tr
                    sx={{
                        th: { px: 2, zIndex: 2 },
                        '&::after': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: rawHeight,
                            background: 'white'
                        }
                    }}
                    pos="sticky"
                    zIndex="4"
                    top="0"
                    left="0"
                    w="100%"
                    h={rawHeight}
                >
                    <Th
                        pos="relative"
                        zIndex={1}
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
                    <Th
                        pos="relative"
                        zIndex={1}
                        minW="320px"
                        bg="background.contentTint"
                        boxSizing="content-box"
                    >
                        <InvoicesTableSortButton
                            currentColumn={currentSortColumn}
                            direction={sortDirection}
                            column={DTOInvoiceFieldOrder.STATUS}
                            onSetColumn={onSetSortColumn}
                            onToggleDirection={onToggleSortDirection}
                            isDisabled={isLoading || isEmpty}
                        >
                            Status
                        </InvoicesTableSortButton>
                    </Th>
                    <Th
                        pos="relative"
                        zIndex={1}
                        minW="160px"
                        bg="background.contentTint"
                        boxSizing="content-box"
                    >
                        <InvoicesTableSortButton
                            currentColumn={currentSortColumn}
                            direction={sortDirection}
                            column={DTOInvoiceFieldOrder.AMOUNT}
                            onSetColumn={onSetSortColumn}
                            onToggleDirection={onToggleSortDirection}
                            isDisabled={isLoading || isEmpty}
                        >
                            Amount
                        </InvoicesTableSortButton>
                    </Th>
                    <Th
                        pos="relative"
                        zIndex={1}
                        minW="180px"
                        bg="background.contentTint"
                        boxSizing="content-box"
                    >
                        <InvoicesTableSortButton
                            currentColumn={currentSortColumn}
                            direction={sortDirection}
                            column={DTOInvoiceFieldOrder.LIFE_TIME}
                            onSetColumn={onSetSortColumn}
                            onToggleDirection={onToggleSortDirection}
                            isDisabled={isLoading || isEmpty}
                        >
                            Creation Date
                        </InvoicesTableSortButton>
                    </Th>
                    <Th
                        pos="relative"
                        zIndex={1}
                        w="100%"
                        minW="300px"
                        bg="background.contentTint"
                        borderTop="1px"
                        borderTopColor="background.contentTint"
                        borderRight="1px"
                        borderRightColor="background.contentTint"
                        borderTopRightRadius="sm"
                        boxSizing="content-box"
                    >
                        <InvoicesTableSortButton
                            currentColumn={currentSortColumn}
                            direction={sortDirection}
                            column={DTOInvoiceFieldOrder.DESCRIPTION}
                            onSetColumn={onSetSortColumn}
                            onToggleDirection={onToggleSortDirection}
                            isDisabled={isLoading || isEmpty}
                        >
                            Description
                        </InvoicesTableSortButton>
                    </Th>
                </Tr>
            </Thead>
            <Tbody
                ref={tbodyRef}
                sx={{
                    tr: {
                        minWidth: `${tbodyWidth || 0}px`
                    }
                }}
            >
                {body}
            </Tbody>
        </Table>
    );
};

InvoicesTableStructure.displayName = 'InvoicesTableStructure';
