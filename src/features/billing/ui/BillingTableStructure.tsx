import { Table, Tbody, Td, Th, Thead, Tr, Skeleton, forwardRef } from '@chakra-ui/react';
import { useContext, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';

 
export const BillingTableStructure = observer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forwardRef<any, any>(({ children, ...rest }: any, ref: any) => {
        const { rowHeight, isLoading, hasEverLoaded, skeletonRowCount } = useContext(
            BillingHistoryTableContext
        );
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
                    {isLoading && hasEverLoaded
                        ? Array.from({ length: skeletonRowCount || 1 }).map((_, index) => (
                              <Tr key={index} h={rowHeight}>
                                  <Td px="2" boxSizing="content-box">
                                      <Skeleton h="4" />
                                  </Td>
                                  <Td px="2" boxSizing="content-box">
                                      <Skeleton h="4" />
                                  </Td>
                                  <Td px="2" boxSizing="content-box">
                                      <Skeleton h="4" />
                                  </Td>
                              </Tr>
                          ))
                        : children}
                </Tbody>
            </Table>
        );
    })
);
