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
import { ComponentProps, FunctionComponent, PropsWithChildren, useContext, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import { billingStore } from 'src/widgets';

const EmptyTable: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const { rowHeight } = useContext(BillingHistoryTableContext);
    return (
        <Tr h={rowHeight} maxH={rowHeight}>
            <Td border="1px" borderColor="background.contentTint" borderTop="0" colSpan={5}>
                <Center textStyle="body2" color="text.secondary" fontFamily="body">
                    {children}
                </Center>
            </Td>
        </Tr>
    );
};

export const BillingTableStructure = observer(
    forwardRef<PropsWithChildren<ComponentProps<typeof Box>>, typeof Box>(
        ({ children, ...rest }, ref) => {
            let body = children;
            const { rowHeight } = useContext(BillingHistoryTableContext);

            if (!billingStore.isResolved) {
                body = (
                    <EmptyTable>
                        <Spinner />
                    </EmptyTable>
                );
            } else if (!billingStore.billingHistory.length) {
                body = <EmptyTable>No billing history yet</EmptyTable>;
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
                                minW="150px"
                                bg="background.contentTint"
                                borderTop="1px"
                                borderTopColor="background.contentTint"
                                borderLeft="1px"
                                borderLeftColor="background.contentTint"
                                borderTopLeftRadius="sm"
                                boxSizing="content-box"
                            >
                                History
                            </Th>
                            <Th
                                pos="relative"
                                zIndex={1}
                                minW="320px"
                                bg="background.contentTint"
                                boxSizing="content-box"
                            >
                                Action
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
                                Amount
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
        }
    )
);
