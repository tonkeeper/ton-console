import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { ChartCard } from './ChartCard';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { hashString, toColor } from 'src/shared';
import { BarChartOptions } from '../../../model';

export const BarChartCard: FunctionComponent<
    ComponentProps<typeof Box> & {
        onClose: () => void;
        dataSource: Record<string, number>[];
        options?: Omit<BarChartOptions, 'type'>;
    }
> = ({ onClose, dataSource, options, ...rest }) => {
    const [barKinds, colors, xKey] = useMemo(() => {
        const allBarKinds = Object.keys(dataSource[0]);
        const _xKey = options?.xAxisKey || allBarKinds[0];
        const _barKinds = allBarKinds.filter(a => a !== _xKey);
        const _colors = _barKinds.map(a =>
            toColor(hashString(a) ^ 255, {
                min: 30,
                max: 215
            })
        );
        return [_barKinds, _colors, _xKey];
    }, [dataSource, options?.xAxisKey]);

    return (
        <ChartCard
            label="Bar chart"
            onClose={onClose}
            sx={{
                '.recharts-tooltip-wrapper': {
                    outline: 'none'
                }
            }}
            {...rest}
        >
            <ResponsiveContainer width="99%" minWidth="0" height={280}>
                <BarChart
                    width={500}
                    height={280}
                    data={dataSource}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip />
                    {barKinds.map((barKind, index) => (
                        <Bar key={barKind} dataKey={barKind} fill={colors[index]} />
                    ))}
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
