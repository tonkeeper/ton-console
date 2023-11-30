import { Box, Flex } from '@chakra-ui/react';
import {
    FunctionComponent,
    memo,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { AnalyticsTableContext } from './analytics-table-context';
import { getTextWidth } from './analytics-query-ui-utils';

export const AnalyticsQueryTableStructure: FunctionComponent<PropsWithChildren> = memo(() => {
    const {
        columnsWidths,
        isResizingProcess,
        setIsResizingProcess,
        source: { headings },
        setIColumnWidth
    } = useContext(AnalyticsTableContext);
    const [hoverOnColumn, setHoverOnColumn] = useState<number | undefined>(undefined);

    const pressedColumn = useRef<
        { index: number; initialPageX: number; initialWidth: number } | undefined
    >(undefined);

    const textWidths = useMemo(() => headings.map(v => getTextWidth(v)), [headings.join(';')]);

    const changeColWidth = (i: number, change: number) => {
        if (!pressedColumn.current) {
            return;
        }

        const initialWidth = pressedColumn.current!.initialWidth;
        let minWidth = textWidths[i] + 8;
        if (i === 0 || i === headings.length - 1) {
            minWidth += 16;
        } else {
            minWidth += 8;
        }

        let newWidth = initialWidth + change;
        if (newWidth < minWidth) {
            newWidth = minWidth;
        }

        setIColumnWidth(pressedColumn.current!.index, newWidth);
    };

    useEffect(() => {
        const onMouseUp = () => {
            document.body.style.cursor = 'unset';
            setIsResizingProcess(false);
            pressedColumn.current = undefined;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (pressedColumn.current?.index !== undefined) {
                changeColWidth(
                    pressedColumn.current!.index,
                    e.pageX - pressedColumn.current.initialPageX
                );
            }
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    const shouldHighlightSeparator = (i: number) => {
        if (isResizingProcess) {
            return pressedColumn.current && i === pressedColumn.current!.index;
        }

        return hoverOnColumn !== undefined && hoverOnColumn >= i && hoverOnColumn <= i + 1;
    };

    return (
        <Flex
            textStyle="body3"
            zIndex={3}
            align="center"
            h="30px"
            color="text.secondary"
            fontFamily="mono"
            bg="background.content"
        >
            {headings.map((text, i) => (
                <>
                    <Flex
                        key={text}
                        align="center"
                        justify="space-between"
                        flexShrink="0"
                        w={columnsWidths[i]}
                        h="100%"
                        mr={i === headings.length - 1 ? 0 : '-1px'}
                        pr={i === headings.length - 1 ? 4 : 0}
                        pl={i === 0 ? 4 : 2}
                        bg="background.contentTint"
                        borderTopLeftRadius={i === 0 ? 'sm' : 'unset'}
                        borderTopRightRadius={i === headings.length - 1 ? 'sm' : 'unset'}
                        _hover={{
                            bg: 'background.page'
                        }}
                        cursor="default"
                        transition="0.15s background ease-in-out"
                        onMouseOut={() =>
                            setTimeout(
                                () => setHoverOnColumn(index => (index === i ? undefined : index)),
                                50
                            )
                        }
                        onMouseOver={() => setHoverOnColumn(i)}
                    >
                        {text}
                    </Flex>
                    {i !== headings.length - 1 && (
                        <Box
                            pos="relative"
                            w="1px"
                            minW="1px"
                            h="100%"
                            cursor="col-resize"
                            transition="background-color 0.15s ease-in-out"
                            bgColor={
                                shouldHighlightSeparator(i)
                                    ? 'background.placeholderDark'
                                    : 'background.contentTint'
                            }
                            onMouseDown={e => {
                                setIsResizingProcess(true);
                                document.body.style.cursor = 'col-resize';
                                pressedColumn.current = {
                                    index: i,
                                    initialPageX: e.pageX,
                                    initialWidth: columnsWidths[i]
                                };
                            }}
                            onMouseOut={() =>
                                setTimeout(
                                    () =>
                                        setHoverOnColumn(index =>
                                            index === i + 0.5 ? undefined : index
                                        ),
                                    50
                                )
                            }
                            onMouseOver={() => setHoverOnColumn(i + 0.5)}
                        >
                            <Box pos="absolute" left="-7px" w="16px" h="100%"></Box>
                        </Box>
                    )}
                </>
            ))}
        </Flex>
    );
});

AnalyticsQueryTableStructure.displayName = 'AnalyticsQueryTableStructure';
