import {
    ComponentProps,
    FunctionComponent,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Box, Flex, forwardRef } from '@chakra-ui/react';
import { VariableSizeGrid } from 'react-window';
import { AnalyticsTableSource } from 'src/features';
import { AnalyticsQueryResultsTableRow } from './AnalyticsQueryResultsTableRow';
import AutoSizer from 'react-virtualized-auto-sizer';

let canvas: HTMLCanvasElement | undefined;
function getTextWidth(text: string, font = 'normal 12px monospace'): number {
    canvas ||= document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

function getTHWidth(text: string, isEdge: boolean): number {
    const px = 24;
    const edgePadding = isEdge ? 16 : 0;
    return getTextWidth(text) + 2 * px + edgePadding;
}

export const AnalyticsTable: FunctionComponent<
    ComponentProps<typeof Box> & { source: AnalyticsTableSource }
> = ({ source, ...rest }) => {
    const [tableWidth, setTableWidth] = useState(0);
    const [columnsWidths, setColumnsWidths] = useState(
        source.headings.map((v, i) => getTHWidth(v, i === 0 || i === source.headings.length - 1))
    );

    const getWidths = useCallback(() => {
        const widths = source.headings.map((v, i) =>
            getTHWidth(v, i === 0 || i === source.headings.length - 1)
        );

        const total = widths.reduce((acc, w) => acc + w, 0);
        if (total < tableWidth) {
            widths[widths.length - 1] += tableWidth - total;
        }

        return widths;
    }, [source.headings.join(','), tableWidth]);

    const gridRef = useRef<VariableSizeGrid>(null);

    useLayoutEffect(() => {
        setColumnsWidths(getWidths());
        gridRef.current?.resetAfterColumnIndex(0);
    }, [getWidths, gridRef]);

    const TableStruct = useMemo(
        () =>
            forwardRef(({ children, ...restProps }, ref) => {
                return (
                    <Box ref={ref} {...restProps}>
                        <Flex
                            textStyle="body3"
                            pos="sticky"
                            zIndex={3}
                            top="0"
                            align="center"
                            h="30px"
                            color="text.secondary"
                            fontFamily="mono"
                            bg="background.content"
                        >
                            {source.headings.map((text, i) => (
                                <Flex
                                    key={text}
                                    align="center"
                                    justify={
                                        i === source.headings.length - 1 &&
                                        source.headings.length > 1
                                            ? 'flex-end'
                                            : 'flex-start'
                                    }
                                    flexShrink="0"
                                    w={columnsWidths[i]}
                                    h="100%"
                                    pr={i === source.headings.length - 1 ? 4 : 2}
                                    pl={i === 0 ? 4 : 2}
                                    bg="background.contentTint"
                                    borderTopLeftRadius={i === 0 ? 'sm' : 'unset'}
                                    borderTopRightRadius={
                                        i === source.headings.length - 1 ? 'sm' : 'unset'
                                    }
                                >
                                    {text}
                                </Flex>
                            ))}
                        </Flex>
                        {children}
                    </Box>
                );
            }),
        [source.headings.join(','), columnsWidths.join(';')]
    );

    return (
        <Box {...rest}>
            <AutoSizer onResize={v => setTableWidth(v.width || 0)}>
                {({ width, height }) => (
                    <VariableSizeGrid
                        ref={gridRef}
                        columnCount={source.headings.length}
                        columnWidth={i => columnsWidths[i]}
                        height={height || 300}
                        rowCount={source.data.length}
                        rowHeight={() => 35}
                        width={width || 800}
                        innerElementType={TableStruct}
                    >
                        {params => <AnalyticsQueryResultsTableRow source={source} {...params} />}
                    </VariableSizeGrid>
                )}
            </AutoSizer>
        </Box>
    );
};
