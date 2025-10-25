import { FC, useMemo, useState } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { AnalyticsHistoryTableStore } from '../../model';
import AnalyticsHistoryTableRow from './AnalyticsHistoryTableRow';
import { AnalyticsHistoryTableStructure } from './AnalyticsHistoryTableStructure';
import { AnalyticsHistoryTableContext } from './analytics-history-table-context';
import ExplainSQLModal from '../ExplainSQLModal';

interface AnalyticsHistoryTableProps extends BoxProps {
    analyticsHistoryTableStore: AnalyticsHistoryTableStore;
}

const AnalyticsHistoryTable: FC<AnalyticsHistoryTableProps> = ({
    analyticsHistoryTableStore,
    ...props
}) => {
    const [queryForModal, setQueryForModal] = useState<string | null>(null);
    const rowHeight = '68px';

    const contextValue = useMemo(() => ({
        rowHeight,
        setQueryForModal,
        analyticsHistoryTableStore
    }), [analyticsHistoryTableStore]);

    return (
        <>
            <AnalyticsHistoryTableContext.Provider
                value={contextValue}
            >
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
