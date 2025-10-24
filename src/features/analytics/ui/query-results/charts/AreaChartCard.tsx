import { ComponentProps, FC, useMemo } from 'react';
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
import { hashString, hexToRGBA, toColor } from 'src/shared';
import { AreaChartOptions } from '../../../model';

export const AreaChartCard: FC<
    ComponentProps<typeof Box> & {
        onClose: () => void;
        dataSource: Record<string, number>[];
        options?: Omit<AreaChartOptions, 'type'>;
    }
> = ({ onClose, dataSource, options, ...rest }) => {
    const [areas, colors, xKey] = useMemo(() => {
        const allAreas = Object.keys(dataSource[0]);
        const _xKey = options?.xAxisKey || allAreas[0];
        const _areas = allAreas.filter(a => a !== _xKey);
        const _colors = _areas.map(a =>
            toColor(hashString(a) ^ 255, {
                min: 30,
                max: 215
            })
        );
        return [_areas, _colors, _xKey];
    }, [dataSource, options?.xAxisKey]);

    return (
        <ChartCard
            label="Area chart"
            onClose={onClose}
            sx={{
                '.recharts-tooltip-wrapper': {
                    outline: 'none'
                }
            }}
            {...rest}
        >
            <ResponsiveContainer width="99%" minWidth="0" height={280}>
                <AreaChart
                    width={300}
                    height={280}
                    data={dataSource}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip />
                    {areas.map((area, index) => (
                        <Area
                            key={area}
                            type="monotone"
                            dataKey={area}
                            stackId="1"
                            stroke={colors[index]}
                            fill={hexToRGBA(colors[index], 0.6)}
                        />
                    ))}
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
