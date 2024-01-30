import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import { Observer, observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { BillingTableStructure } from './BillingTableStructure';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import { billingStore } from '../model';
import BillingTableRow from './BillingTableRow';

const BillingHistoryTable: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const rowHeight = '48px';

    const minH = billingStore.isResolved
        ? Math.min(parseInt(rowHeight) * (billingStore.billingHistory.length + 1) + 6, 800) + 'px'
        : '102px';

    return (
        <BillingHistoryTableContext.Provider value={{ rowHeight }}>
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
