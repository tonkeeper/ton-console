/* eslint-disable chakra-ui/props-order*/

import { FunctionComponent, useRef } from 'react';
import { Box, Flex, Link, Tooltip, useClipboard, useDisclosure } from '@chakra-ui/react';
import { AnalyticsTableSource } from 'src/features';
import { Span } from 'src/shared';

export const AnalyticsQueryResultsTableRow: FunctionComponent<{
    source: AnalyticsTableSource;
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    // eslint-disable-next-line complexity
}> = ({ source, columnIndex, rowIndex, style: { top, ...style } }) => {
    const content = source.data[rowIndex][columnIndex];
    const isLink = content.startsWith('https://') || content.startsWith('http://');
    const { isOpen, onClose, onOpen } = useDisclosure();
    const ref = useRef<HTMLDivElement | null>(null);
    const { hasCopied, onCopy } = useClipboard(content);

    const node = ref.current;
    const canShowTooltip =
        node && (node.offsetWidth < node.scrollWidth || node.offsetHeight < node.scrollHeight);

    const contentView = (
        <Box
            overflow="hidden"
            fontFamily="mono"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            cursor={canShowTooltip ? 'pointer' : 'default'}
            onClick={canShowTooltip && !isLink ? onCopy : undefined}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            ref={ref}
        >
            {isLink ? (
                <Link href={content} isExternal>
                    {content}
                </Link>
            ) : (
                content
            )}
        </Box>
    );

    return (
        <Flex
            textStyle="body3"
            top={`${parseInt(top?.toString() || '0') + 30}px`}
            align="center"
            justify="flex-start"
            pr={columnIndex === source.headings.length - 1 ? 4 : 2}
            pl={columnIndex === 0 ? 4 : 2}
            borderRight={columnIndex === source.headings.length - 1 ? '1px' : 'none'}
            borderBottom="1px"
            borderBottomColor="separator.common"
            borderColor="separator.common"
            borderRightColor="separator.common"
            borderLeft={columnIndex === 0 ? '1px' : 'none'}
            borderLeftColor="separator.common"
            borderBottomLeftRadius={
                rowIndex === source.data.length - 1 && columnIndex === 0 ? 'sm' : 'none'
            }
            borderBottomRightRadius={
                rowIndex === source.data.length - 1 && columnIndex === source.headings.length - 1
                    ? 'sm'
                    : 'none'
            }
            style={style}
        >
            {canShowTooltip ? (
                <Tooltip
                    closeDelay={0}
                    closeOnScroll
                    hasArrow
                    label={<Span textStyle="body3">{!hasCopied ? content : 'Copied!'}</Span>}
                    isOpen={isOpen}
                >
                    {contentView}
                </Tooltip>
            ) : (
                contentView
            )}
        </Flex>
    );
};
