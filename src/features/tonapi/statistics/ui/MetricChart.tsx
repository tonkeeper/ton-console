import { FC, useCallback, useMemo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
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
import { toDate, toDateTime } from 'src/shared';
import { ChartPoint } from '../model/queries';

interface MetricChartProps extends BoxProps {
    data: ChartPoint[];
    title: string;
    color: string;
    limit?: number;
    limitLabel?: string;
    height?: number;
}

const MetricChart: FC<MetricChartProps> = ({
    data,
    title,
    color,
    limit,
    limitLabel = 'Limit',
    height = 250,
    ...props
}) => {
    const ticks = useMemo(() => {
        if (!data?.length) {
            return [];
        }

        const items = data.filter((_, index) => index % 48 === 0).map(i => i.time);
        if (!items.includes(data[data.length - 1].time)) {
            items.push(data[data.length - 1].time);
        }

        return items;
    }, [data]);

    const formatTooltip = useCallback((timestamp: number) => toDateTime(new Date(timestamp)), []);
    const formatXLabel = useCallback((timestamp: number) => toDate(new Date(timestamp)), []);

    const shouldDrawLimit = useMemo(() => {
        if (!data?.length || !limit) {
            return false;
        }

        const values = data.map(item => item.value);
        return Math.max(...values) >= limit * 0.67;
    }, [data, limit]);

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
                                stroke="#F53C36"
                            />
                            <Line
                                dot={false}
                                dataKey="ReferenceLineStub"
                                name={limitLabel}
                                stroke="#F53C36"
                            />
                        </>
                    )}
                    <XAxis
                        dataKey="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatXLabel}
                        name="time"
                        type="number"
                        ticks={ticks.length > 0 ? ticks : undefined}
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
