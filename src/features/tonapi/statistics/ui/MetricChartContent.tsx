import { FC } from 'react';
import { Box, BoxProps, Center, Spinner, Text } from '@chakra-ui/react';
import MetricChart from './MetricChart';
import { ChartPoint } from '../model/queries';
import { TimePeriod } from '../model/time-periods';

interface MetricChartContentProps extends BoxProps {
    title: string;
    data: ChartPoint[] | null;
    isLoading: boolean;
    error?: Error | null;
    color: string;
    limit?: number;
    limitLabel?: string;
    period?: TimePeriod;
}

const MetricChartContent: FC<MetricChartContentProps> = ({
    title,
    data,
    isLoading,
    error,
    color,
    limit,
    limitLabel,
    period,
    ...props
}) => {
    if (isLoading) {
        return (
            <Box w="100%" {...props}>
                <Text textStyle="body2" mb="2" color="text.secondary">
                    {title}
                </Text>
                <Center h="200px">
                    <Spinner />
                </Center>
            </Box>
        );
    }

    if (error) {
        return (
            <Box w="100%" {...props}>
                <Text textStyle="body2" mb="2" color="text.secondary">
                    {title}
                </Text>
                <Center h="200px">
                    <Text textStyle="body2" color="text.error">
                        Error loading data
                    </Text>
                </Center>
            </Box>
        );
    }

    return (
        <Box w="100%" {...props}>
            <Text textStyle="body2" mb="2" color="text.secondary">
                {title}
            </Text>
            <Box w="100%" h="200px">
                <MetricChart
                    data={data || []}
                    title={title}
                    color={color}
                    limit={limit}
                    limitLabel={limitLabel}
                    height={200}
                    period={period}
                />
            </Box>
        </Box>
    );
};

export default MetricChartContent;
