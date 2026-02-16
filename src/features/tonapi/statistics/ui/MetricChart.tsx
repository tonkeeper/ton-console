import { FC, useCallback, useMemo } from 'react';
import { Box, BoxProps, Center, Text, useTheme } from '@chakra-ui/react';
import {
    LineChart,
    Line,
    YAxis,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
    ReferenceLine
} from 'recharts';
import { toDate, toDateTime, toTime } from 'src/shared';
import { ChartPoint } from '../model/queries';
import { TimePeriod, getTimestampRange } from '../model/time-periods';

interface MetricChartProps extends BoxProps {
    data: ChartPoint[];
    title: string;
    color: string;
    limit?: number;
    limitLabel?: string;
    height?: number;
    period?: TimePeriod;
}

const MetricChart: FC<MetricChartProps> = ({
    data,
    title,
    color,
    limit,
    limitLabel = 'Limit',
    height = 250,
    period,
    ...props
}) => {
    const { colors } = useTheme();

    const { domain, ticks } = useMemo(() => {
        if (!period) {
            const tickList: number[] = [];
            if (data?.length) {
                const items = data.filter((_, index) => index % 48 === 0).map(i => i.time);
                if (!items.includes(data[data.length - 1].time)) {
                    items.push(data[data.length - 1].time);
                }
                tickList.push(...items);
            }
            return { domain: ['dataMin', 'dataMax'] as const, ticks: tickList };
        }

        const range = getTimestampRange(period);
        const startMs = range.start * 1000;
        const endMs = range.end * 1000;
        const tickCount = 7;
        const tickInterval = (endMs - startMs) / tickCount;
        const tickList: number[] = [];
        for (let i = 0; i <= tickCount; i++) {
            tickList.push(startMs + tickInterval * i);
        }
        return { domain: [startMs, endMs], ticks: tickList };
    }, [period, data]);

    const formatTooltip = useCallback((timestamp: number) => toDateTime(new Date(timestamp)), []);
    const formatXLabel = useCallback(
        (timestamp: number) => {
            const date = new Date(timestamp);
            if (period === 'last_6h' || period === 'last_24h') {
                return toTime(date);
            }
            return toDate(date);
        },
        [period]
    );

    const shouldDrawLimit = useMemo(() => {
        if (!data?.length || !limit) {
            return false;
        }

        const values = data.map(item => item.value).filter(
            (v): v is number => v !== undefined
        );
        return values.length > 0 && Math.max(...values) >= limit * 0.67;
    }, [data, limit]);

    if (!data.length) {
        return (
            <Box h={`${height}px`} {...props}>
                <Center h="100%">
                    <Text textStyle="body2" color="text.secondary">
                        No data for this period
                    </Text>
                </Center>
            </Box>
        );
    }

    return (
        <Box
            h={`${height}px`}
            {...props}
            sx={{
                '.recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child': {
                    strokeOpacity: 0
                }
            }}
        >
            <ResponsiveContainer width="99%" height="100%">
                <LineChart
                    width={400}
                    height={height}
                    data={data}
                    margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                        dot={false}
                        type="monotone"
                        dataKey="value"
                        name={title}
                        stroke={color}
                        isAnimationActive={false}
                    />
                    {shouldDrawLimit && limit && (
                        <>
                            <ReferenceLine
                                ifOverflow="extendDomain"
                                y={limit}
                                stroke={colors.accent.red}
                            />
                            <Line
                                dot={false}
                                dataKey="ReferenceLineStub"
                                name={limitLabel}
                                stroke={colors.accent.red}
                            />
                        </>
                    )}
                    <XAxis
                        dataKey="time"
                        domain={domain}
                        tickFormatter={formatXLabel}
                        name="time"
                        type="number"
                        ticks={ticks.length > 0 ? ticks : undefined}
                        allowDataOverflow={!!period}
                        minTickGap={period ? 50 : undefined}
                    />
                    <YAxis padding={{ top: 10, bottom: 0 }} />
                    <Tooltip labelFormatter={formatTooltip} />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default MetricChart;
