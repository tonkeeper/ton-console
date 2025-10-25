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
    Center,
    BoxProps
} from '@chakra-ui/react';
import { FC, PropsWithChildren, useContext, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { AnalyticsHistoryTableContext } from './analytics-history-table-context';
import { EmptyFolderIcon48 } from 'src/shared';

const EmptyTable: FC<PropsWithChildren<BoxProps>> = ({ children, ...props }) => {
    const { rowHeight } = useContext(AnalyticsHistoryTableContext);
    return (
        <Tr h={rowHeight} maxH={rowHeight}>
            <Td
                h="192px"
                border="1px"
                borderColor="background.contentTint"
                borderTop="0"
                colSpan={4}
            >
                <Center textStyle="body2" color="text.secondary" fontFamily="body" {...props}>
                    {children}
                </Center>
            </Td>
        </Tr>
    );
};

export const AnalyticsHistoryTableStructure = observer(
    forwardRef<PropsWithChildren<BoxProps>, typeof Box>(({ children, ...rest }, ref) => {
        let body = children;
        const { rowHeight, analyticsHistoryTableStore } = useContext(AnalyticsHistoryTableContext);

        if (!analyticsHistoryTableStore.queries$.isResolved) {
            body = (
                <EmptyTable>
                    <Spinner />
                </EmptyTable>
            );
        } else if (!analyticsHistoryTableStore.queries$.value.length) {
            body = (
                <EmptyTable display="flex" flexDirection="column">
                    <EmptyFolderIcon48 />
                    <Box>No history yet</Box>
                    <Box>Your requests will show up here.</Box>
                </EmptyTable>
            );
        }

        const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
        const tbodyWidth = tbodyRef.current?.clientWidth;

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
                        sx={{
                            th: { px: 2, zIndex: 2 },
                            '&::after': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: rowHeight,
                                background: 'white'
                            }
                        }}
                        pos="sticky"
                        zIndex="4"
                        top="0"
                        left="0"
                        w="100%"
                        h={rowHeight}
                    >
                        <Th
                            pos="relative"
                            zIndex={1}
                            minW="176px"
                            bg="background.contentTint"
                            borderTop="1px"
                            borderTopColor="background.contentTint"
                            borderLeft="1px"
                            borderLeftColor="background.contentTint"
                            borderTopLeftRadius="sm"
                            boxSizing="content-box"
                        >
                            Duration/Value
                        </Th>
                        <Th
                            pos="relative"
                            zIndex={1}
                            minW="108px"
                            bg="background.contentTint"
                            boxSizing="content-box"
                        >
                            Status
                        </Th>
                        <Th
                            pos="relative"
                            zIndex={1}
                            w="100%"
                            minW="300px"
                            bg="background.contentTint"
                            boxSizing="content-box"
                        >
                            Name / Request
                        </Th>
                        <Th
                            pos="relative"
                            zIndex={1}
                            w="120px"
                            minW="120px"
                            maxW="120px"
                            textAlign="right"
                            bg="background.contentTint"
                            borderTop="1px"
                            borderTopColor="background.contentTint"
                            borderRight="1px"
                            borderRightColor="background.contentTint"
                            borderTopRightRadius="sm"
                            boxSizing="content-box"
                        >
                            Date
                        </Th>
                    </Tr>
                </Thead>
                <Tbody
                    ref={tbodyRef}
                    sx={{
                        tr: {
                            minWidth: `${tbodyWidth || 0}px` // SAFARI width: 100% bug workaround
                        }
                    }}
                >
                    {body}
                </Tbody>
            </Table>
        );
    })
);
