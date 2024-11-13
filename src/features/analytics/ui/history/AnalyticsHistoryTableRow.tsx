import { FC, useContext, CSSProperties } from 'react';
import { Box, Button, Center, Flex, Spinner, Td, Tr, useConst } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import {
    AnalyticsGraphQuery,
    analyticsHistoryTableStore,
    AnalyticsQuery,
    AnalyticsRepeatingQueryAggregated,
    isAnalyticsRepeatingQueryAggregated
} from '../../model';
import {
    TooltipHoverable,
    toTimeLeft,
    toDateTime,
    useCountup,
    Span,
    sliceAddress,
    InfoTooltip,
    useCountdown
} from 'src/shared';
import { toJS } from 'mobx';
import { AnalyticsHistoryTableContext } from './analytics-history-table-context';
import { AnalyticsQueryStatusBadge } from './AnalyticsQueryStatusBadge';
import { Link } from 'react-router-dom';
import { formatRepeatInterval } from '../utils';
import { TestnetBadge } from 'src/features/analytics/ui/history/TestnetBadge';

const LoadingRow: FC<{ style: React.CSSProperties }> = ({ style: { top, ...style } }) => {
    const { rowHeight } = useContext(AnalyticsHistoryTableContext);
    return (
        <Tr
            top={parseFloat(top!.toString()) + parseFloat(rowHeight) + 'px'}
            h={rowHeight}
            maxH={rowHeight}
            style={style}
        >
            <Td pos="absolute" right="0" left="0" border="none" colSpan={4}>
                <Center>
                    <Spinner color="text.secondary" size="sm" />
                </Center>
            </Td>
        </Tr>
    );
};

const ItemRow: FC<{
    query: AnalyticsQuery | AnalyticsRepeatingQueryAggregated | AnalyticsGraphQuery;
    style: CSSProperties;
}> = observer(({ query: q, style }) => {
    const renderTime = useConst(Date.now());

    const { rowHeight } = useContext(AnalyticsHistoryTableContext);

    const isAggregated = isAnalyticsRepeatingQueryAggregated(q);
    const isCurrentlyRepeating = isAggregated && q.repeatFrequencyMs;

    const query = isAggregated ? q.lastQuery : q;

    const passedSeconds =
        query.status === 'executing'
            ? Math.floor((renderTime - query.creationDate.getTime()) / 1000)
            : 0;

    const durationSeconds = useCountup(passedSeconds);
    const formattedDuration = durationSeconds === 0 ? '' : toTimeLeft(durationSeconds * 1000);

    const repeatInterval = formatRepeatInterval(
        'repeatFrequencyMs' in q ? q.repeatFrequencyMs : undefined
    );

    const secondsBeforeNextRepetition = isCurrentlyRepeating
        ? Math.floor((q.lastQueryDate.getTime() + q.repeatFrequencyMs - renderTime) / 1000)
        : 0;

    const beforeNextRepetition = useCountdown(secondsBeforeNextRepetition);

    return (
        <Link to={`../${query.type === 'graph' ? 'graph' : 'query'}?id=${query.id}`}>
            <Tr
                sx={{ td: { px: 2, py: 0 } }}
                pos="absolute"
                top={parseFloat(style.top!.toString()) + parseFloat(rowHeight) + 'px'}
                left="0"
                display="table-row"
                w="100%"
                h={rowHeight}
                maxH={rowHeight}
            >
                <Td
                    alignContent="center"
                    minW="176px"
                    h={rowHeight}
                    maxH={rowHeight}
                    borderLeft="1px"
                    borderLeftColor="background.contentTint"
                    boxSizing="content-box"
                >
                    {isAggregated ? (
                        isCurrentlyRepeating ? (
                            <Flex align="center" wrap="wrap" color="text.secondary">
                                Every {repeatInterval}
                                <InfoTooltip ml="2px">
                                    <Box w="280px" color="text.primary">
                                        <Flex justify="space-between" mb="3">
                                            <Span color="text.secondary">Periodicity</Span>
                                            <Span>Every {repeatInterval}</Span>
                                        </Flex>
                                        <Flex justify="space-between" mb="3">
                                            <Span color="text.secondary">
                                                Number of repetitions
                                            </Span>
                                            <Span>{q.totalRepetitions}</Span>
                                        </Flex>
                                        <Flex justify="space-between" mb="3">
                                            <Span color="text.secondary">Recent request</Span>
                                            <Span>{toDateTime(q.lastQueryDate)}</Span>
                                        </Flex>
                                        <Flex align="center">
                                            <Span color="text.secondary">Next</Span>
                                            <Box ml="auto">
                                                <Span>
                                                    {toTimeLeft(beforeNextRepetition * 1000)}
                                                </Span>
                                                {beforeNextRepetition === 0 && (
                                                    <Button
                                                        ml="2"
                                                        onClick={() =>
                                                            analyticsHistoryTableStore.loadFirstPage()
                                                        }
                                                        size="sm"
                                                    >
                                                        Refresh
                                                    </Button>
                                                )}
                                            </Box>
                                        </Flex>
                                    </Box>
                                </InfoTooltip>
                                &nbsp;· {q.totalCost.stringCurrencyAmount}
                            </Flex>
                        ) : (
                            <Flex align="center" wrap="wrap" color="text.secondary">
                                <Span>{q.totalRepetitions} times</Span>
                                &nbsp;· {q.totalCost.stringCurrencyAmount} total
                            </Flex>
                        )
                    ) : query.status === 'success' || query.status === 'error' ? (
                        <Flex align="center" wrap="wrap" color="text.secondary">
                            {query.spentTimeMS < 1000 ? (
                                '≈1s'
                            ) : (
                                <Span>{toTimeLeft(query.spentTimeMS)}</Span>
                            )}
                            &nbsp;· {query.cost.stringCurrencyAmount}
                        </Flex>
                    ) : (
                        formattedDuration
                    )}
                </Td>
                <Td
                    alignContent="center"
                    minW="108px"
                    h={rowHeight}
                    maxH={rowHeight}
                    boxSizing="content-box"
                >
                    {query.status === 'error' ? (
                        <TooltipHoverable
                            canBeShown
                            host={<AnalyticsQueryStatusBadge status={query.status} />}
                        >
                            {query.errorReason}
                        </TooltipHoverable>
                    ) : (
                        <AnalyticsQueryStatusBadge status={query.status} />
                    )}
                </Td>
                <Td
                    alignContent="center"
                    w="100%"
                    minW="300px"
                    h={rowHeight}
                    maxH={rowHeight}
                    boxSizing="content-box"
                >
                    <Flex gap="2">
                        <Box wordBreak="break-word" noOfLines={2}>
                            {query.type === 'graph' ? (
                                <>
                                    Graph:&nbsp;
                                    <Span color="accent.blue">
                                        {query.addresses
                                            .map(a => sliceAddress(a.userFriendly))
                                            .join(', ')}
                                    </Span>
                                </>
                            ) : (
                                <TooltipHoverable
                                    canBeShown={true}
                                    placement="top"
                                    host={
                                        <Span cursor="default">
                                            {query.name || query.gptPrompt || query.request}
                                        </Span>
                                    }
                                >
                                    <Span color="text.primary" overflow="auto">
                                        <pre>{query.request}</pre>
                                    </Span>
                                </TooltipHoverable>
                            )}
                        </Box>
                        {query.type !== 'graph' && query.network === 'testnet' && (
                            <TestnetBadge flexShrink={0} alignSelf="center" />
                        )}
                    </Flex>
                </Td>
                <Td
                    alignContent="center"
                    w="120px"
                    minW="120px"
                    maxW="120px"
                    h={rowHeight}
                    maxH={rowHeight}
                    color="text.secondary"
                    textAlign="right"
                    borderRight="1px"
                    borderRightColor="background.contentTint"
                    boxSizing="content-box"
                >
                    {toDateTime(query.creationDate)}
                </Td>
            </Tr>
        </Link>
    );
});

const AnalyticsHistoryTableRow: FC<{
    index: number;
    style: React.CSSProperties;
}> = ({ index, style }) => {
    if (analyticsHistoryTableStore.isItemLoaded(index)) {
        const query = toJS(analyticsHistoryTableStore.queries$.value[index]);
        const id = isAnalyticsRepeatingQueryAggregated(query) ? query.lastQuery.id : query.id;
        return <ItemRow key={id} style={style} query={query} />;
    }

    return <LoadingRow style={style} />;
};

export default observer(AnalyticsHistoryTableRow);
