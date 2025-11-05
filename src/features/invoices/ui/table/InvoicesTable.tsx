import { FC, useCallback } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import InvoicesTableRaw from './InvoicesTableRaw';
import { InvoicesTableStructure } from './InvoicesTableStructure';
import { InvoicesTableContext } from 'src/features/invoices/ui/table/invoices-table-context';
import { Invoice, InvoiceTableColumn } from '../../models';

interface Props extends BoxProps {
    invoices: Invoice[];
    isLoading: boolean;
    isEmpty: boolean;
    currentSortColumn?: InvoiceTableColumn;
    sortDirection?: 'asc' | 'desc';
    onSetSortColumn: (column: InvoiceTableColumn) => void;
    onToggleSortDirection: () => void;
    onCancel: (id: string) => Promise<void>;
    isCancelLoading: boolean;
    onLoadMore?: () => Promise<void>;
}

const InvoicesTable: FC<Props> = ({
    invoices,
    isLoading,
    isEmpty,
    currentSortColumn,
    sortDirection = 'desc',
    onSetSortColumn,
    onToggleSortDirection,
    onCancel,
    isCancelLoading,
    onLoadMore,
    ...props
}) => {
    const rawHeight = '48px';

    const isItemLoaded = (index: number) => !isLoading && index < invoices.length;

    const innerElementType = useCallback(
        ({ children, ...rest }: Record<string, unknown>) => (
            <InvoicesTableStructure
                {...rest}
                isLoading={isLoading}
                isEmpty={isEmpty}
                currentSortColumn={currentSortColumn}
                sortDirection={sortDirection}
                onSetSortColumn={onSetSortColumn}
                onToggleSortDirection={onToggleSortDirection}
            >
                {children as React.ReactNode}
            </InvoicesTableStructure>
        ),
        [isLoading, isEmpty, currentSortColumn, sortDirection, onSetSortColumn, onToggleSortDirection]
    );

    return (
        <InvoicesTableContext.Provider
            value={{
                rawHeight,
                invoices,
                onCancel,
                isCancelLoading
            }}
        >
            <Box {...props}>
                <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={invoices.length + (isLoading && !isEmpty ? 1 : 0)}
                    loadMoreItems={onLoadMore || (() => Promise.resolve())}
                >
                    {({ onItemsRendered, ref }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    height={height!}
                                    width={width!}
                                    itemCount={invoices.length + (isLoading && !isEmpty ? 1 : 0)}
                                    onItemsRendered={onItemsRendered}
                                    itemSize={parseInt(rawHeight)}
                                    innerElementType={innerElementType}
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

export default InvoicesTable;
