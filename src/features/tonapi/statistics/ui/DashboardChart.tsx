import { FC } from 'react';
import { useDisclosure, BoxProps, useTheme } from '@chakra-ui/react';
import { useRestStats, TimePeriod } from 'src/features/tonapi/statistics/model/queries';
import { useSelectedRestApiTier } from 'src/features/tonapi/pricing/model/queries';
import MetricChartCard from './MetricChartCard';
import MetricChartModal from './MetricChartModal';

interface DashboardChartProps extends BoxProps {
    period: TimePeriod;
}

const DashboardChart: FC<DashboardChartProps> = ({ period, ...props }) => {
    const { colors } = useTheme();
    const { data, isLoading, error } = useRestStats(period);
    const { data: selectedTier, isLoading: isTierLoading } = useSelectedRestApiTier();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isLoading_ = isLoading || isTierLoading;

    return (
        <>
            <MetricChartCard
                title="REST API requests on behalf"
                data={data || null}
                isLoading={isLoading_}
                error={error}
                color={colors.accent.blue}
                limit={selectedTier?.rps}
                limitLabel="Limit"
                onExpand={onOpen}
                {...props}
            />
            <MetricChartModal
                isOpen={isOpen}
                onClose={onClose}
                title="REST API Statistics"
                charts={
                    data && data.length > 0
                        ? [
                              {
                                  title: 'AVG req. per second',
                                  data,
                                  color: colors.accent.blue,
                                  limit: selectedTier?.rps,
                                  limitLabel: 'Limit'
                              }
                          ]
                        : []
                }
            />
        </>
    );
};

export default DashboardChart;
