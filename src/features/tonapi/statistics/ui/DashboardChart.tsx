import { FC, useCallback, useMemo } from 'react';
import { Box, BoxProps, Center, Spinner, Text, useTheme } from '@chakra-ui/react';
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
import { observer } from 'mobx-react-lite';
import { tonApiStatsStore, restApiTiersStore } from 'src/shared/stores';
import { toDate, toDateTime } from 'src/shared';
import { toJS } from 'mobx';

const DashboardChart: FC<BoxProps> = props => {
    const { colors } = useTheme();
    const data = tonApiStatsStore.restStats$.value;
    const selectedTier = restApiTiersStore.selectedTier$.value;

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
        if (!data?.length || !selectedTier) {
            return false;
        }

        const requests = data.map(item => item.value);
        return Math.max(...requests) >= selectedTier.rps * 0.67;
    }, [data, selectedTier]);

    if (!tonApiStatsStore.restStats$.isResolved || !restApiTiersStore.selectedTier$.isResolved) {
        return (
            <Center h="200px" {...props}>
                <Spinner />
            </Center>
        );
    }

    if (!data?.length || !selectedTier) {
        return (
            <Text textStyle="body2" py="6" color="text.secondary" textAlign="center">
                No data available
            </Text>
        );
    }

    return (
        <Box
            h="350px"
            {...props}
            sx={{
                '.recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child': {
                    strokeOpacity: 0
                }
            }}
        >
            <ResponsiveContainer width="99%" height="100%">
                <LineChart width={400} height={400} data={toJS(data)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                        dot={false}
                        type="monotone"
                        dataKey="requests"
                        name="AVG req. per second"
                        stroke={colors.accent.blue}
                    />
                    {shouldDrawLimit && (
                        <>
                            <ReferenceLine
                                ifOverflow="extendDomain"
                                y={selectedTier?.rps}
                                stroke={colors.accent.red}
                            />
                            <Line
                                dot={false}
                                dataKey="ReferenceLineStub"
                                name="Limit"
                                stroke={colors.accent.red}
                            />
                        </>
                    )}
                    <XAxis
                        dataKey="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatXLabel}
                        name="time"
                        type="number"
                        ticks={ticks}
                    />
                    <YAxis padding={{ top: 10 }} />
                    <Tooltip labelFormatter={formatTooltip} />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default observer(DashboardChart);
