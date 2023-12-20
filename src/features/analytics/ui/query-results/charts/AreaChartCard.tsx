import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { ChartCard } from './ChartCard';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { AreaChartData } from 'src/features';
import { hexToRGBA, lightHashString, toColor } from 'src/shared';

export const AreaChartCard: FunctionComponent<
    ComponentProps<typeof Box> & { onClose: () => void; data: AreaChartData }
> = ({ onClose, data, ...rest }) => {
    const [areas, colors] = useMemo(() => {
        const allAreas = Object.keys(data.points[0]);
        const _areas = allAreas.filter(a => a !== data.xAxisKey);
        const _colors = _areas.map(a =>
            toColor(Math.abs(lightHashString(a) ^ 255), { min: 30, max: 215 })
        );
        return [_areas, _colors];
    }, [data.points, data.xAxisKey]);

    return (
        <ChartCard label="Area chart" onClose={onClose} {...rest}>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                    width={500}
                    height={280}
                    data={data.points}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={data.xAxisKey} />
                    <YAxis />
                    <Tooltip />
                    {areas.map((area, index) => (
                        <Area
                            key={area}
                            type="monotone"
                            dataKey={area}
                            stackId="1"
                            stroke={hexToRGBA(colors[index], 0.8)}
                            fill={colors[index]}
                        />
                    ))}
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
