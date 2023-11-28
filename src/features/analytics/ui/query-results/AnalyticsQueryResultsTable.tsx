import { ComponentProps, FunctionComponent, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { VariableSizeGrid } from 'react-window';
import { AnalyticsTableSource } from 'src/features';
import { AnalyticsQueryResultsTableRow } from './AnalyticsQueryResultsTableRow';
import AutoSizer from 'react-virtualized-auto-sizer';
import { AnalyticsTableContext } from './analytics-table-context';
import { AnalyticsQueryTableStructure } from './AnalyticsQueryTableStructure';
import { getTextWidth, getTHWidth, removeOutliers } from './analytics-query-ui-utils';

const MAX_INITIAL_COL_WIDTH = 500;

export const AnalyticsTable: FunctionComponent<
    ComponentProps<typeof Box> & { source: AnalyticsTableSource }
> = ({ source, ...rest }) => {
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
            <Box userSelect={isResizingProcess ? 'none' : 'auto'} {...rest}>
                <AutoSizer>
                    {({ width, height }) => (
                        <VariableSizeGrid
                            ref={gridRef}
                            columnCount={source.headings.length}
                            columnWidth={i => columnsWidths[i]}
                            height={height || 300}
                            rowCount={source.data.length}
                            rowHeight={() => 35}
                            width={width || 800}
                            innerElementType={AnalyticsQueryTableStructure}
                        >
                            {params => (
                                <AnalyticsQueryResultsTableRow source={source} {...params} />
                            )}
                        </VariableSizeGrid>
                    )}
                </AutoSizer>
            </Box>
        </AnalyticsTableContext.Provider>
    );
};
