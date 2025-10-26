import { FC } from 'react';
import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { BillingTableStructure } from './BillingTableStructure';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import { BillingHistoryItem } from '../model';
import BillingTableRow from './BillingTableRow';

interface BillingHistoryTableProps extends BoxProps {
    billingHistory: BillingHistoryItem[];
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
    hasBillingHistory?: boolean;
}

const BillingHistoryTable: FC<BillingHistoryTableProps> = ({
    billingHistory,
    isLoading = false,
    hasEverLoaded = false,
    skeletonRowCount = 1,
    hasBillingHistory = undefined,
    ...props
}) => {
    const actualIsLoading = isLoading;
    const actualHasBillingHistory = hasBillingHistory ?? billingHistory.length > 0;
    const rowHeight = '48px';

    // First load - show Spinner (height of header + one row: 48px + 48px = 96px)
    if (!hasEverLoaded && actualIsLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    // No data and not loading - show Empty message (height of header + one row: 48px + 48px = 96px)
    if (!actualIsLoading && !actualHasBillingHistory) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No billing history yet
            </Box>
        );
    }

    // Display item count: during refresh show skeleton rows, otherwise show actual data
    const displayItemCount = actualIsLoading && hasEverLoaded ? skeletonRowCount : billingHistory.length;

    // Table with data or skeleton
    const minH = Math.min(parseInt(rowHeight) * (displayItemCount + 1) + 6, 800) + 'px';

    // Table with data or skeleton
    return (
        <BillingHistoryTableContext.Provider
            value={{
                billingHistory,
                rowHeight,
                isLoading: actualIsLoading,
                hasEverLoaded,
                skeletonRowCount
            }}
        >
            <Box minH={minH} {...props}>
                <InfiniteLoader
                    isItemLoaded={(index) => index < billingHistory.length}
                    itemCount={displayItemCount}
                    loadMoreItems={() => {}}
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    height={height!}
                                    width={width!}
                                    itemCount={displayItemCount}
                                    onItemsRendered={onItemsRendered}
                                    itemSize={parseInt(rowHeight)}
                                    innerElementType={BillingTableStructure}
                                    ref={ref}
                                >
                                    {BillingTableRow}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </Box>
        </BillingHistoryTableContext.Provider>
    );
};

export default observer(BillingHistoryTable);
