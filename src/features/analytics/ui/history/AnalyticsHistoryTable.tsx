import { FC, useState } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { analyticsHistoryTableStore } from '../../model';
import AnalyticsHistoryTableRow from './AnalyticsHistoryTableRow';
import { AnalyticsHistoryTableStructure } from './AnalyticsHistoryTableStructure';
import { AnalyticsHistoryTableContext } from './analytics-history-table-context';
import ExplainSQLModal from '../ExplainSQLModal';

const AnalyticsHistoryTable: FC<BoxProps> = props => {
    const [queryForModal, setQueryForModal] = useState<string | null>(null);
    const rowHeight = '68px';

    return (
        <>
            <AnalyticsHistoryTableContext.Provider value={{ rowHeight, setQueryForModal }}>
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
            <ExplainSQLModal
                isOpen={queryForModal !== null}
                onClose={() => setQueryForModal(null)}
                request={queryForModal ?? undefined}
                title="Request"
            />
        </>
    );
};

export default observer(AnalyticsHistoryTable);
