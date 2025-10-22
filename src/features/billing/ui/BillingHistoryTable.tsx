import { FC } from 'react';
import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { Observer, observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { BillingTableStructure } from './BillingTableStructure';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import { billingStore } from '../model';
import BillingTableRow from './BillingTableRow';

interface BillingHistoryTableProps extends BoxProps {
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
    hasBillingHistory?: boolean;
}

const BillingHistoryTable: FC<BillingHistoryTableProps> = ({
    isLoading = billingStore.billingHistoryLoading,
    hasEverLoaded = false,
    skeletonRowCount = 1,
    hasBillingHistory = billingStore.billingHistory.length > 0,
    ...props
}) => {
    const rowHeight = '48px';

    // First load - show Spinner (height of header + one row: 48px + 48px = 96px)
    if (!hasEverLoaded && isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    // No data and not loading - show Empty message (height of header + one row: 48px + 48px = 96px)
    if (!isLoading && !hasBillingHistory) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No billing history yet
            </Box>
        );
    }

    // Table with data or skeleton
    const minH = billingStore.isResolved
        ? Math.min(parseInt(rowHeight) * (billingStore.billingHistory.length + 1) + 6, 800) + 'px'
        : '102px';

    // Table with data or skeleton
    return (
        <BillingHistoryTableContext.Provider
            value={{
                rowHeight,
                isLoading,
                hasEverLoaded,
                skeletonRowCount
            }}
        >
            <Box minH={minH} {...props}>
                <InfiniteLoader
                    isItemLoaded={billingStore.isItemLoaded}
                    itemCount={billingStore.totalItems}
                    loadMoreItems={
                        billingStore.isPageLoading || !billingStore.isResolved
                            ? () => {}
                            : () => billingStore.loadNextPage()
                    }
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <Observer>
                                    {() => (
                                        <FixedSizeList
                                            height={height!}
                                            width={width!}
                                            itemCount={billingStore.tableContentLength}
                                            onItemsRendered={onItemsRendered}
                                            itemSize={parseInt(rowHeight)}
                                            innerElementType={BillingTableStructure}
                                            ref={ref}
                                        >
                                            {BillingTableRow}
                                        </FixedSizeList>
                                    )}
                                </Observer>
                            )}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </Box>
        </BillingHistoryTableContext.Provider>
    );
};

export default observer(BillingHistoryTable);
