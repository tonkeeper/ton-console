import { Table, Tbody, Th, Thead, Tr, forwardRef, Box } from '@chakra-ui/react';
import { ComponentProps, PropsWithChildren } from 'react';
import InvoicesTableColumnLabel from './InvoicesTableSortButton';

export const InvoicesTableStructure = forwardRef<
    PropsWithChildren<ComponentProps<typeof Box>>,
    typeof Box
>(({ children, ...rest }, ref) => {
    return (
        <Box {...rest} ref={ref}>
            <Table
                sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
                pos="sticky"
                top="0"
                w="100%"
                variant="simple"
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
                            minW="192px"
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
                            minW="108px"
                            bg="background.contentTint"
                            boxSizing="content-box"
                        >
                            <InvoicesTableColumnLabel column="life-time">
                                Life time
                            </InvoicesTableColumnLabel>
                        </Th>
                        <Th
                            pos="sticky"
                            top="0"
                            minW="228px"
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
                            minW="148px"
                            bg="background.contentTint"
                            boxSizing="content-box"
                        >
                            <InvoicesTableColumnLabel column="receiver-address">
                                Recipient address
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
                <Tbody>{children}</Tbody>
            </Table>
        </Box>
    );
});
