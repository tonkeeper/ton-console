import { FC } from 'react';
import { useDisclosure, BoxProps, useTheme, Center, Text } from '@chakra-ui/react';
import { useLiteproxyStats, TimePeriod } from 'src/features/tonapi/statistics/model/queries';
import { useSelectedLiteproxyTier } from 'src/features/tonapi/liteproxy/model/queries';
import MetricGroupCard from './MetricGroupCard';
import MetricChartContent from './MetricChartContent';
import MetricChartModal from './MetricChartModal';

interface DashboardLiteproxyChartProps extends BoxProps {
    period: TimePeriod;
    childrenDirection?: 'row' | 'column';
}

const DashboardLiteproxyChart: FC<DashboardLiteproxyChartProps> = ({ period, childrenDirection, ...props }) => {
    const { colors } = useTheme();
    const { data, isLoading, error } = useLiteproxyStats(period);
    const { data: selectedLiteproxyTier } = useSelectedLiteproxyTier();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const requestsData = data?.requests || null;
    const connectionsData = data?.connections || null;
    const hasData = !!(requestsData && requestsData.length > 0 && connectionsData && connectionsData.length > 0);
    const isServiceActive = !!selectedLiteproxyTier;

    // c. If no active tier and no data history, don't render anything
    if (!isServiceActive && !hasData) {
        return null;
    }

    // d. If no active tier but has history, show as inactive
    if (!isServiceActive && hasData) {
        return (
            <Center
                flexDir="column"
                gap="4"
                minH="200px"
                borderWidth="1px"
                borderRadius="12px"
                {...props}
            >
                <Text color="text.secondary">Liteservers service is not activated</Text>
            </Center>
        );
    }

    // Now we know: isServiceActive === true
    // a. Has tier + has data → show charts with data
    // b. Has tier + no data → show empty state (MetricChartContent handles this)

    return (
        <>
            <MetricGroupCard
                title="Liteservers Statistics"
                onExpand={onOpen}
                hasData={hasData}
                childrenDirection={childrenDirection}
                {...props}
            >
                <MetricChartContent
                    title="Requests"
                    data={requestsData}
                    isLoading={isLoading}
                    error={error}
                    color={colors.accent.blue}
                    limit={selectedLiteproxyTier?.rps}
                    limitLabel="Limit"
                    period={period}
                />
                <MetricChartContent
                    title="Connections"
                    data={connectionsData}
                    isLoading={isLoading}
                    error={error}
                    color={colors.accent.green}
                    period={period}
                />
            </MetricGroupCard>
            <MetricChartModal
                isOpen={isOpen}
                onClose={onClose}
                title="Liteservers Statistics"
                period={period}
                charts={[
                    {
                        title: 'Liteservers Requests',
                        data: requestsData || [],
                        color: colors.accent.blue,
                        limit: selectedLiteproxyTier?.rps,
                        limitLabel: 'Limit'
                    },
                    {
                        title: 'Liteservers Connections',
                        data: connectionsData || [],
                        color: colors.accent.green
                    }
                ]}
            />
        </>
    );
};

export default DashboardLiteproxyChart;
