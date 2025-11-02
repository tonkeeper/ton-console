import { FC } from 'react';
import { Box, BoxProps, Center, Spinner, Text } from '@chakra-ui/react';
import MetricChart from './MetricChart';
import { ChartPoint } from '../model/queries';

interface MetricChartContentProps extends BoxProps {
    title: string;
    data: ChartPoint[] | null;
    isLoading: boolean;
    error?: Error | null;
    color: string;
    limit?: number;
    limitLabel?: string;
    compact?: boolean;
}

const MetricChartContent: FC<MetricChartContentProps> = ({
    title,
    data,
    isLoading,
    error,
    color,
    limit,
    limitLabel,
    compact = false,
    ...props
}) => {
    const emptyHeight = compact ? '120px' : '200px';
    const dataHeight = compact ? '150px' : '200px';

    if (isLoading) {
        return (
            <Box {...props}>
                <Text textStyle="body2" mb="2" color="text.secondary">
                    {title}
                </Text>
                <Center h={emptyHeight}>
                    <Spinner />
                </Center>
            </Box>
        );
    }

    if (error) {
        return (
            <Box {...props}>
                <Text textStyle="body2" mb="2" color="text.secondary">
                    {title}
                </Text>
                <Center h={emptyHeight}>
                    <Text textStyle="body2" color="text.error">
                        Error loading data
                    </Text>
                </Center>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box {...props}>
                <Text textStyle="body2" mb="2" color="text.secondary">
                    {title}
                </Text>
                <Center h={emptyHeight}>
                    <Text textStyle="body2" color="text.secondary">
                        Empty data
                    </Text>
                </Center>
            </Box>
        );
    }

    return (
        <Box {...props}>
            <Text textStyle="body2" mb="2" color="text.secondary">
                {title}
            </Text>
            <Box h={dataHeight}>
                <MetricChart
                    data={data}
                    title={title}
                    color={color}
                    limit={limit}
                    limitLabel={limitLabel}
                    height={compact ? 150 : 200}
                />
            </Box>
        </Box>
    );
};

export default MetricChartContent;
