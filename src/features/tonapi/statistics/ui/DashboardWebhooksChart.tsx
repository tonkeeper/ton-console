import { FC } from 'react';
import { useDisclosure, BoxProps, useTheme, Center, Text } from '@chakra-ui/react';
import {
    useWebhooksStatsQuery,
    mapWebhooksStatsToChartPoints
} from 'src/features/tonapi/webhooks/model/queries';
import { useSelectedLiteproxyTier } from 'src/features/tonapi/liteproxy/model/queries';
import { TimePeriod } from '../model/queries';
import MetricGroupCard from './MetricGroupCard';
import MetricChartContent from './MetricChartContent';
import MetricChartModal from './MetricChartModal';

interface DashboardWebhooksChartProps extends BoxProps {
    period: TimePeriod;
    childrenDirection?: 'row' | 'column';
}

const DashboardWebhooksChart: FC<DashboardWebhooksChartProps> = ({
    period,
    childrenDirection,
    ...props
}) => {
    const { colors } = useTheme();
    const { data, isLoading, error } = useWebhooksStatsQuery(period);
    const { data: selectedLiteproxyTier } = useSelectedLiteproxyTier();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const failedData = data ? mapWebhooksStatsToChartPoints(data, 'failed') : null;
    const deliveredData = data ? mapWebhooksStatsToChartPoints(data, 'delivered') : null;
    const hasData =
        (failedData && failedData.length > 0) || (deliveredData && deliveredData.length > 0);
    const isServiceActive = !!selectedLiteproxyTier;

    // c. If no data at all (never used), don't render - even if tier is active
    // User requirement: don't show empty webhooks charts if never ordered/used
    if (!hasData) {
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
                <Text color="text.secondary">Webhooks service is not activated</Text>
            </Center>
        );
    }

    // Now we know: isServiceActive === true && hasData === true
    // Show charts with data

    return (
        <>
            <MetricGroupCard
                title="Webhook"
                onExpand={onOpen}
                hasData={hasData}
                childrenDirection={childrenDirection}
                {...props}
            >
                <MetricChartContent
                    title="Delivered"
                    data={deliveredData && deliveredData.length > 0 ? deliveredData : null}
                    isLoading={isLoading}
                    error={error}
                    color={colors.accent.blue}
                    period={period}
                />
                <MetricChartContent
                    title="Failed"
                    data={failedData && failedData.length > 0 ? failedData : null}
                    isLoading={isLoading}
                    error={error}
                    color={colors.accent.red}
                    period={period}
                />
            </MetricGroupCard>
            <MetricChartModal
                isOpen={isOpen}
                onClose={onClose}
                title="Webhook"
                period={period}
                charts={[
                    {
                        title: 'Delivered webhook requests',
                        data: deliveredData && deliveredData.length > 0 ? deliveredData : [],
                        color: colors.accent.blue
                    },
                    {
                        title: 'Failed webhook requests',
                        data: failedData && failedData.length > 0 ? failedData : [],
                        color: colors.accent.red
                    }
                ]}
            />
        </>
    );
};

export default DashboardWebhooksChart;
