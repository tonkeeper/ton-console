import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { BillingTableStructure } from './BillingTableStructure';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import { billingStore } from '../model';
import BillingTableRow from './BillingTableRow';

const BillingHistoryTable: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const rowHeight = '48px';

    return (
        <BillingHistoryTableContext.Provider value={{ rowHeight }}>
            <Box
                minH={
                    Math.min(
                        parseInt(rowHeight) * (billingStore.billingHistory.length + 1) + 6,
                        800
                    ) + 'px'
                }
                {...props}
            >
                <InfiniteLoader
                    isItemLoaded={billingStore.isItemLoaded}
                    itemCount={billingStore.totalItems}
                    loadMoreItems={
                        billingStore.loadNextPage.isLoading || !billingStore.isResolved
                            ? () => {}
                            : () => billingStore.loadNextPage()
                    }
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
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
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </Box>
        </BillingHistoryTableContext.Provider>
    );
};

export default observer(BillingHistoryTable);
