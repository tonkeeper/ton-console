import { FC } from 'react';
import { Box, BoxProps, Center, Spinner, Text, Flex, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import MetricChart from './MetricChart';
import { ChartPoint } from '../model/queries';
import { TimePeriod } from '../model/time-periods';

interface MetricChartCardProps extends BoxProps {
    title: string;
    data: ChartPoint[] | null;
    isLoading: boolean;
    error?: Error | null;
    color: string;
    limit?: number;
    limitLabel?: string;
    onExpand?: () => void;
    period?: TimePeriod;
}

const MetricChartCard: FC<MetricChartCardProps> = ({
    title,
    data,
    isLoading,
    error,
    color,
    limit,
    limitLabel,
    onExpand,
    period,
    ...props
}) => {
    if (isLoading) {
        return (
            <Box
                p="4"
                borderWidth="1px"
                borderColor="border.primary"
                borderRadius="12px"
                {...props}
            >
                <Flex align="center" justify="space-between" mb="4">
                    <Text textStyle="label1" color="text.primary">
                        {title}
                    </Text>
                    {onExpand && data?.length && (
                        <IconButton
                            aria-label="Expand chart"
                            icon={<ChevronUpIcon />}
                            onClick={onExpand}
                            size="sm"
                            variant="ghost"
                        />
                    )}
                </Flex>
                <Center h="200px">
                    <Spinner />
                </Center>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                p="4"
                borderWidth="1px"
                borderColor="border.primary"
                borderRadius="12px"
                {...props}
            >
                <Flex align="center" justify="space-between" mb="4">
                    <Text textStyle="label1" color="text.primary">
                        {title}
                    </Text>
                    {onExpand && data?.length && (
                        <IconButton
                            aria-label="Expand chart"
                            icon={<ChevronUpIcon />}
                            onClick={onExpand}
                            size="sm"
                            variant="ghost"
                        />
                    )}
                </Flex>
                <Center h="200px">
                    <Text textStyle="body2" color="text.secondary">
                        Error loading data
                    </Text>
                </Center>
            </Box>
        );
    }

    return (
        <Box
            p="4"
            borderWidth="1px"
            borderColor="border.primary"
            borderRadius="12px"
            {...props}
        >
            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="label1" color="text.primary">
                    {title}
                </Text>
                {onExpand && (
                    <IconButton
                        aria-label="Expand chart"
                        icon={<ChevronUpIcon />}
                        onClick={onExpand}
                        size="sm"
                        variant="ghost"
                    />
                )}
            </Flex>
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
    );
};

export default MetricChartCard;
