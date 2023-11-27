import { ComponentProps, FunctionComponent } from 'react';
import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { analyticsHistoryTableStore } from '../../model';
import AnalyticsHistoryTableRow from './AnalyticsHistoryTableRow';
import { AnalyticsHistoryTableStructure } from './AnalyticsHistoryTableStructure';
import { AnalyticsHistoryTableContext } from './analytics-history-table-context';

const AnalyticsHistoryTable: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const rowHeight = '68px';

    return (
        <AnalyticsHistoryTableContext.Provider value={{ rowHeight }}>
            <Box {...props}>
                <InfiniteLoader
                    isItemLoaded={analyticsHistoryTableStore.isItemLoaded}
                    itemCount={analyticsHistoryTableStore.tableContentLength}
                    loadMoreItems={
                        analyticsHistoryTableStore.loadNextPage.isLoading ||
                        !analyticsHistoryTableStore.queries$.isResolved
                            ? () => {}
                            : () => analyticsHistoryTableStore.loadNextPage()
                    }
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    height={height!}
                                    width={width!}
                                    itemCount={analyticsHistoryTableStore.tableContentLength}
                                    onItemsRendered={onItemsRendered}
                                    itemSize={parseInt(rowHeight)}
                                    innerElementType={AnalyticsHistoryTableStructure}
                                    ref={ref}
                                >
                                    {AnalyticsHistoryTableRow}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </Box>
        </AnalyticsHistoryTableContext.Provider>
    );
};

export default observer(AnalyticsHistoryTable);
