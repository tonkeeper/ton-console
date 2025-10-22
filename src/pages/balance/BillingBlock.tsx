import { FC, useEffect, useState } from 'react';
import { Box, Center, Spinner, Table, Tbody, Td, Th, Thead, Tr, Skeleton } from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { BillingHistoryTable, billingStore } from 'src/widgets';

const BillingBlockSkeleton: FC<{ rowCount: number }> = ({ rowCount }) => (
    <Box border="1px" borderColor="background.contentTint" borderRadius="sm">
        <Table
            sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
            w="100%"
            variant="withBottomBorder"
        >
            <Thead>
                <Tr
                    sx={{
                        th: { px: 2, zIndex: 2 }
                    }}
                    pos="sticky"
                    zIndex="4"
                    top="0"
                    left="0"
                    w="100%"
                    h="48px"
                >
                    <Th
                        pos="relative"
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
                        minW="320px"
                        bg="background.contentTint"
                        boxSizing="content-box"
                    >
                        Action
                    </Th>
                    <Th
                        pos="relative"
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
            <Tbody>
                {Array.from({ length: rowCount }).map((_, index) => (
                    <Tr key={index} h="48px">
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
                ))}
            </Tbody>
        </Table>
    </Box>
);

const BillingBlock: FC = () => {
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const [previousRowCount, setPreviousRowCount] = useState(0);
    const hasBillingHistory = billingStore.billingHistory.length > 0;
    const isLoading = billingStore.billingHistoryLoading;

    // Track whether data has ever been loaded and remember the row count
    useEffect(() => {
        if (!isLoading && hasBillingHistory) {
            setHasEverLoaded(true);
            setPreviousRowCount(billingStore.billingHistory.length);
        }
    }, [isLoading, hasBillingHistory, billingStore.billingHistory.length]);

    // Calculate skeleton row count: min(previousRowCount or 1, 20)
    const skeletonRowCount = Math.min(previousRowCount || 1, 20);

    return (
        <Box px="6" py="5">
            <H4 mb="5">Billing History</H4>
            {isLoading && !hasEverLoaded ? (
                <Center h="100px">
                    <Spinner />
                </Center>
            ) : isLoading && hasEverLoaded ? (
                <BillingBlockSkeleton rowCount={skeletonRowCount} />
            ) : hasBillingHistory ? (
                <BillingHistoryTable />
            ) : (
                <Box my="-2px" py="10" color="text.secondary" textAlign="center">
                    No billing history yet
                </Box>
            )}
        </Box>
    );
};

export default observer(BillingBlock);
