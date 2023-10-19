/* eslint-disable chakra-ui/props-order*/

import { FunctionComponent } from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import { AnalyticsTableSource } from 'src/features';
import { TooltipHoverable } from 'src/shared';

export const AnalyticsQueryResultsTableRow: FunctionComponent<{
    source: AnalyticsTableSource;
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
}> = ({ source, columnIndex, rowIndex, style: { top, ...style } }) => {
    const content = source.data[rowIndex][columnIndex];
    const isLink = content.startsWith('https://') || content.startsWith('http://');

    return (
        <Flex
            textStyle="body3"
            top={`${parseInt(top?.toString() || '0') + 30}px`}
            align="center"
            justify={columnIndex === source.headings.length - 1 ? 'flex-end' : 'flex-start'}
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
            <TooltipHoverable
                host={
                    <Box
                        overflow="hidden"
                        fontFamily="mono"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                    >
                        {isLink ? (
                            <Link href={content} isExternal>
                                {content}
                            </Link>
                        ) : (
                            content
                        )}
                    </Box>
                }
            >
                {content}
            </TooltipHoverable>
        </Flex>
    );
};
