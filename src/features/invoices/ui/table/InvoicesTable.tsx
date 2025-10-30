import { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { InvoicesTableStore } from '../../models';
import InvoicesTableRaw from './InvoicesTableRaw';
import { InvoicesTableStructure } from './InvoicesTableStructure';
import { InvoicesTableContext } from 'src/features/invoices/ui/table/invoices-table-context';

interface Props extends BoxProps {
    invoicesTableStore: InvoicesTableStore;
}

const InvoicesTable: FC<Props> = ({ invoicesTableStore, ...props }) => {
    const rawHeight = '48px';

    return (
        <InvoicesTableContext.Provider value={{ rawHeight, invoicesTableStore }}>
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
