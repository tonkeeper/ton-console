/* eslint-disable react/prop-types*/

import { memo, useRef } from 'react';
import { Box, BoxProps, Flex, Link, Tooltip, useClipboard, useDisclosure } from '@chakra-ui/react';
import { Span } from 'src/shared';

export const AnalyticsQueryResultsTableRow = memo<{ content: string } & BoxProps>(
    ({ content, ...rest }) => {
        const isLink = content.startsWith('https://') || content.startsWith('http://');
        const { isOpen, onClose, onOpen } = useDisclosure();
        const ref = useRef<HTMLDivElement | null>(null);
        const { hasCopied, onCopy } = useClipboard(content);

        const node = ref.current;
        const canShowTooltip =
            node && (node.offsetWidth < node.scrollWidth || node.offsetHeight < node.scrollHeight);

        const contentView = (
            <Box
                ref={ref}
                overflow="hidden"
                fontFamily="mono"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                cursor={canShowTooltip ? 'pointer' : 'default'}
                onClick={canShowTooltip && !isLink ? onCopy : undefined}
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
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
                align="center"
                justify="flex-start"
                borderColor="separator.common"
                borderRightColor="separator.common"
                borderBottom="1px"
                borderBottomColor="separator.common"
                borderLeftColor="separator.common"
                {...rest}
            >
                {canShowTooltip ? (
                    <Tooltip
                        closeDelay={0}
                        closeOnScroll
                        hasArrow
                        isOpen={isOpen}
                        label={<Span textStyle="body3">{!hasCopied ? content : 'Copied!'}</Span>}
                    >
                        {contentView}
                    </Tooltip>
                ) : (
                    contentView
                )}
            </Flex>
        );
    }
);

AnalyticsQueryResultsTableRow.displayName = 'AnalyticsQueryResultsTableRow';
