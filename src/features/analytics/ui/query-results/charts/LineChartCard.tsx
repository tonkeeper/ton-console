import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { ChartCard } from './ChartCard';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { hashString, hexToRGBA, toColor } from 'src/shared';
import { LineChartOptions } from '../../../model';

export const LineChartCard: FunctionComponent<
    ComponentProps<typeof Box> & {
        onClose: () => void;
        dataSource: Record<string, number>[];
        options?: Omit<LineChartOptions, 'type'>;
    }
> = ({ onClose, dataSource, options, ...rest }) => {
    const [lines, colors, xKey] = useMemo(() => {
        const allLines = Object.keys(dataSource[0]);
        const _xKey = allLines[0];
        const _lines = allLines.filter(a => a !== _xKey);
        const _colors = _lines.map(a =>
            toColor(hashString(a) ^ 255, {
                min: 30,
                max: 215
            })
        );
        return [_lines, _colors, _xKey];
    }, [dataSource]);

    return (
        <ChartCard
            label="Line chart"
            onClose={onClose}
            sx={{
                '.recharts-tooltip-wrapper': {
                    outline: 'none'
                }
            }}
            {...rest}
        >
            <ResponsiveContainer width="99%" minWidth="0" height={280}>
                <LineChart
                    width={500}
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
                    {lines.map((line, index) => (
                        <Line
                            key={line}
                            type="monotone"
                            dataKey={line}
                            stroke={colors[index]}
                            fill={hexToRGBA(colors[index], 0.6)}
                        />
                    ))}
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
