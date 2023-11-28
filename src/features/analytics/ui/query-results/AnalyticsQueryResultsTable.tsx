import { ComponentProps, FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, forwardRef } from '@chakra-ui/react';
import { VariableSizeGrid } from 'react-window';
import { AnalyticsTableSource } from 'src/features';
import { AnalyticsQueryResultsTableRow } from './AnalyticsQueryResultsTableRow';
import AutoSizer from 'react-virtualized-auto-sizer';

function removeOutliers(numbers: number[]): number[] {
    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const variance =
        numbers.reduce((sum, num) => sum + Math.pow(num - average, 2), 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);
    const threshold = 2 * standardDeviation;

    return numbers.filter(num => num <= average + threshold);
}

let canvas: HTMLCanvasElement | undefined;
let context: CanvasRenderingContext2D | undefined;
let font: string | undefined;
function getTextWidth(text: string, useFont = 'normal 12px monospace'): number {
    canvas ||= document.createElement('canvas');
    context ||= canvas.getContext('2d')!;
    if (font !== useFont) {
        context.font = useFont;
    }
    const metrics = context.measureText(text);
    return metrics.width;
}

function getTHWidth(textWidth: number, isEdge: boolean): number {
    const px = 24;
    const edgePadding = isEdge ? 16 : 0;
    return textWidth + 2 * px + edgePadding;
}

const SLIDER_WIDTH = 4;
const MAX_INITIAL_COL_WIDTH = 500;

export const AnalyticsTable: FunctionComponent<
    ComponentProps<typeof Box> & { source: AnalyticsTableSource }
> = ({ source, ...rest }) => {
    const gridRef = useRef<VariableSizeGrid>(null);
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
    const pressedColumn = useRef<
        { index: number; initialPageX: number; initialWidth: number } | undefined
    >(undefined);

    const textWidths = useMemo(
        () => source.headings.map(v => getTextWidth(v)),
        [source.headings.join(';')]
    );

    const [isResizingProcess, setIsResizingProcess] = useState(false);

    const changeColWidth = (i: number, change: number) => {
        if (!pressedColumn.current) {
            return;
        }

        const initialWidth = pressedColumn.current!.initialWidth;
        let minWidth = textWidths[i] + SLIDER_WIDTH + 8;
        if (i === 0 || i === source.headings.length - 1) {
            minWidth += 16;
        } else {
            minWidth += 8;
        }

        setColumnsWidths(widths => {
            let newWidth = initialWidth + change;
            if (newWidth < minWidth) {
                newWidth = minWidth;
            }

            const w = widths.slice();
            w[i] = newWidth;
            return w;
        });
    };

    useEffect(() => {
        const onMouseUp = () => {
            setIsResizingProcess(false);
            pressedColumn.current = undefined;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (pressedColumn.current?.index !== undefined) {
                changeColWidth(
                    pressedColumn.current!.index,
                    e.pageX - pressedColumn.current.initialPageX
                );
                gridRef.current?.resetAfterColumnIndex(pressedColumn.current!.index);
            }
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

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
                                <>
                                    <Flex
                                        key={text}
                                        align="center"
                                        justify="space-between"
                                        flexShrink="0"
                                        w={columnsWidths[i]}
                                        h="100%"
                                        pr={i === source.headings.length - 1 ? 4 : 0}
                                        pl={i === 0 ? 4 : 2}
                                        bg="background.contentTint"
                                        borderTopLeftRadius={i === 0 ? 'sm' : 'unset'}
                                        borderTopRightRadius={
                                            i === source.headings.length - 1 ? 'sm' : 'unset'
                                        }
                                    >
                                        {text}
                                        {i !== source.headings.length - 1 && (
                                            <Box
                                                w={SLIDER_WIDTH + 'px'}
                                                minW={SLIDER_WIDTH + 'px'}
                                                h="100%"
                                                ml={i === source.headings.length - 1 ? 0 : 2}
                                                bg="black"
                                                cursor="col-resize"
                                                onMouseDown={e => {
                                                    setIsResizingProcess(true);
                                                    pressedColumn.current = {
                                                        index: i,
                                                        initialPageX: e.pageX,
                                                        initialWidth: columnsWidths[i]
                                                    };
                                                }}
                                            ></Box>
                                        )}
                                    </Flex>
                                </>
                            ))}
                        </Flex>
                        {children}
                    </Box>
                );
            }),
        [source.headings.join(','), columnsWidths.join(';')]
    );

    return (
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
                        innerElementType={TableStruct}
                    >
                        {params => <AnalyticsQueryResultsTableRow source={source} {...params} />}
                    </VariableSizeGrid>
                )}
            </AutoSizer>
        </Box>
    );
};
