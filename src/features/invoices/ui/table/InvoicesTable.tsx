import { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { invoicesTableStore } from '../../models';
import InvoicesTableRaw from './InvoicesTableRaw';
import { InvoicesTableStructure } from './InvoicesTableStructure';
import { InvoicesTableContext } from 'src/features/invoices/ui/table/invoices-table-context';

const InvoicesTable: FC<BoxProps> = props => {
    const rawHeight = '48px';

    return (
        <InvoicesTableContext.Provider value={{ rawHeight }}>
            <Box {...props}>
                <InfiniteLoader
                    isItemLoaded={invoicesTableStore.isItemLoaded}
                    itemCount={invoicesTableStore.tableContentLength}
                    loadMoreItems={
                        invoicesTableStore.loadNextPage.isLoading ||
                        !invoicesTableStore.invoices$.isResolved
                            ? () => {}
                            : () => invoicesTableStore.loadNextPage()
                    }
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    height={height!}
                                    width={width!}
                                    itemCount={invoicesTableStore.tableContentLength}
                                    onItemsRendered={onItemsRendered}
                                    itemSize={parseInt(rawHeight)}
                                    innerElementType={InvoicesTableStructure}
                                    ref={ref}
                                >
                                    {InvoicesTableRaw}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </Box>
        </InvoicesTableContext.Provider>
    );
};

export default observer(InvoicesTable);
