import { FC, useRef, useState } from 'react';
import { Box, BoxProps, Grid } from '@chakra-ui/react';
import { VariableSizeGrid } from 'react-window';
import { AnalyticsTableSource } from 'src/features';
import { AnalyticsQueryResultsTableRow } from './AnalyticsQueryResultsTableRow';
import { AnalyticsTableContext } from './analytics-table-context';
import { AnalyticsQueryTableStructure } from './AnalyticsQueryTableStructure';
import { getTextWidth, getTHWidth, removeOutliers } from './analytics-query-ui-utils';
import AutoSizer from 'react-virtualized-auto-sizer';

const MAX_INITIAL_COL_WIDTH = 500;

export const AnalyticsTable: FC<BoxProps & { source: AnalyticsTableSource }> = ({
    source,
    ...rest
}) => {
    const gridRef = useRef<VariableSizeGrid>(null);

    const [isResizingProcess, setIsResizingProcess] = useState(false);
    const [columnsWidths, setColumnsWidths] = useState(
        source.headings.map((v, i) => {
            const valuesWidths = removeOutliers(source.data.map(row => getTextWidth(row[i])));
            const headerWidth = getTextWidth(v);
            const max = Math.max(headerWidth, ...valuesWidths);
            return getTHWidth(
                Math.min(MAX_INITIAL_COL_WIDTH, max),
                i === 0 || i === source.headings.length - 1
            );
        })
    );

    const setIColumnWidth = (i: number, width: number) => {
        setColumnsWidths(widths => {
            const w = widths.slice();
            w[i] = width;
            return w;
        });
        gridRef.current?.resetAfterColumnIndex(i);
    };

    const colsNumber = source.headings.length;
    const rowsNumber = source.data.length;

    return (
        <AnalyticsTableContext.Provider
            value={{
                columnsWidths,
                setColumnsWidths,
                isResizingProcess,
                setIsResizingProcess,
                source,
                setIColumnWidth
            }}
        >
            <AutoSizer disableHeight>
                {({ width }) => (
                    <Box
                        overflowY="hidden"
                        w={width}
                        maxW={width}
                        userSelect={isResizingProcess ? 'none' : 'auto'}
                        {...rest}
                    >
                        <AnalyticsQueryTableStructure />
                        <Grid
                            templateRows={`repeat(${rowsNumber}, 35px)`}
                            templateColumns={columnsWidths.map(w => w + 'px').join(' ')}
                        >
                            {source.data.map((row, rowIndex) =>
                                row.map((content, columnIndex) => (
                                    <AnalyticsQueryResultsTableRow
                                        key={rowIndex + '-' + columnIndex + content}
                                        content={content}
                                        pr={columnIndex === colsNumber - 1 ? 4 : 2}
                                        pl={columnIndex === 0 ? 4 : 2}
                                        borderRightWidth={
                                            columnIndex === colsNumber - 1 ? '1px' : '0'
                                        }
                                        borderLeftWidth={columnIndex === 0 ? '1px' : '0'}
                                        borderBottomLeftRadius={
                                            rowIndex === rowsNumber - 1 && columnIndex === 0
                                                ? 'sm'
                                                : 'none'
                                        }
                                        borderBottomRightRadius={
                                            rowIndex === rowsNumber - 1 &&
                                            columnIndex === colsNumber - 1
                                                ? 'sm'
                                                : 'none'
                                        }
                                    />
                                ))
                            )}
                        </Grid>
                    </Box>
                )}
            </AutoSizer>
        </AnalyticsTableContext.Provider>
    );
};
