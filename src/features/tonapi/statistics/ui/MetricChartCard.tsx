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
    compact?: boolean;
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
    compact = false,
    period,
    ...props
}) => {
    const emptyHeight = compact ? '120px' : '200px';
    const dataHeight = compact ? '150px' : '200px';

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
                <Center h={emptyHeight}>
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
                <Center h={emptyHeight}>
                    <Text textStyle="body2" color="text.secondary">
                        Error loading data
                    </Text>
                </Center>
            </Box>
        );
    }

    if (!data?.length) {
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
                </Flex>
                <Center h={emptyHeight}>
                    <Text textStyle="body2" color="text.secondary">
                        Empty data
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
                data={data}
                title={title}
                color={color}
                limit={limit}
                limitLabel={limitLabel}
                height={parseInt(dataHeight)}
                period={period}
            />
        </Box>
    );
};

export default MetricChartCard;
