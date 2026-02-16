import { FC, ReactElement, useMemo } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { ChartCard } from './ChartCard';
import { Cell, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer } from 'recharts';
import { hashString, toColor } from 'src/shared';
import { PieChartOptions } from '../../../model';

const RADIAN = Math.PI / 180;

export const PieChartCard: FC<
    BoxProps & {
        onClose: () => void;
        dataSource: Record<string, number>[];
        options?: Omit<PieChartOptions, 'type'>;
    }
> = ({ onClose, dataSource, ...rest }) => {
    const [data, colors, canBuildChart] = useMemo(() => {
        if (dataSource.length !== 1) {
            return [[], [], false];
        }

        const record = dataSource[0];
        const keys = Object.keys(record);
        const _data = Object.values(record).map((value, index) => ({ name: keys[index], value }));
        const _colors = keys.map(key =>
            toColor(hashString(key) ^ 255, {
                min: 30,
                max: 215
            })
        );

        return [_data, _colors, true];
    }, [dataSource]);

    const renderCustomizedLabel = (props: PieLabelRenderProps): ReactElement => {
        // Extract properties with proper defaults for optional ones
        const cx = Number(props.cx);
        const cy = Number(props.cy);
        const innerRadius = Number(props.innerRadius);
        const outerRadius = Number(props.outerRadius);
        const index = Number(props.index);
        const midAngle = typeof props.midAngle === 'number' ? props.midAngle : 0;
        const percent = typeof props.percent === 'number' ? props.percent : 0;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN) * 2.5;
        const y = cy + radius * Math.sin(-midAngle * RADIAN) * 2.5;

        return (
            <text
                x={x}
                y={y}
                fill={colors[index]}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {data[index].name} {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ChartCard
            label="Pie chart"
            onClose={onClose}
            sx={{
                '.recharts-tooltip-wrapper': {
                    outline: 'none'
                }
            }}
            {...rest}
        >
            {canBuildChart ? (
                <ResponsiveContainer width="99%" minWidth="0" height={280}>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <Flex justify="center" direction="column" gap="3" h="280px" color="accent.red">
                    <Box>Error: can&apos;t build a pie chart using this datasource.</Box>
                    <Box>
                        Make sure your data source contains exactly one row with numeric values
                    </Box>
                </Flex>
            )}
        </ChartCard>
    );
};
