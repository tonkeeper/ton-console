import { FC, useEffect, useState } from 'react';
import {
    Box,
    Center,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Skeleton
} from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { SubscriptionsTable, subscriptionsStore } from 'src/widgets';

const SubscriptionsBlockSkeleton: FC = () => (
    <TableContainer
        minH="100px"
        border="1px"
        borderColor="background.contentTint"
        borderRadius="sm"
    >
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Plan</Th>
                    <Th>Interval</Th>
                    <Th>Renews</Th>
                    <Th textAlign="right">Price</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>
                        <Skeleton h="4" />
                    </Td>
                    <Td>
                        <Skeleton h="4" />
                    </Td>
                    <Td>
                        <Skeleton h="4" />
                    </Td>
                    <Td>
                        <Skeleton h="4" />
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    </TableContainer>
);

const SubscriptionsBlock: FC = () => {
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const hasSubscriptions = subscriptionsStore.subscriptions.length > 0;
    const isLoading = subscriptionsStore.subscriptionsLoading;

    useEffect(() => {
        if (!isLoading && hasSubscriptions) {
            setHasEverLoaded(true);
        }
    }, [isLoading, hasSubscriptions]);

    return (
        <Box px="6" py="5">
            <H4 mb="5">Plans</H4>
            {isLoading && !hasEverLoaded ? (
                <Center h="100px">
                    <Spinner />
                </Center>
            ) : isLoading && hasEverLoaded ? (
                <SubscriptionsBlockSkeleton />
            ) : hasSubscriptions ? (
                <SubscriptionsTable />
            ) : (
                <Box my="-2px" py="10" color="text.secondary" textAlign="center">
                    No plans yet
                </Box>
            )}
        </Box>
    );
};

export default observer(SubscriptionsBlock);
