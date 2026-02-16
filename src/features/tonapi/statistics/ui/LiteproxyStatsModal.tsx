import { FC, useState } from 'react';
import { useTheme } from '@chakra-ui/react';
import { useLiteproxyStats, TimePeriod } from 'src/features/tonapi/statistics/model/queries';
import { useSelectedLiteproxyTier } from 'src/features/tonapi/liteproxy/model/queries';
import MetricChartModal from './MetricChartModal';
import PeriodSelector from './PeriodSelector';

interface LiteproxyStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiteproxyStatsModal: FC<LiteproxyStatsModalProps> = ({ isOpen, onClose }) => {
    const { colors } = useTheme();
    const [period, setPeriod] = useState<TimePeriod>('last_6h');
    const { data } = useLiteproxyStats(period);
    const { data: selectedTier } = useSelectedLiteproxyTier();

    const requestsData = data?.requests || [];
    const connectionsData = data?.connections || [];

    return (
        <MetricChartModal
            isOpen={isOpen}
            onClose={onClose}
            title="Liteservers Statistics"
            headerExtra={<PeriodSelector value={period} onChange={setPeriod} />}
            charts={[
                {
                    title: 'Liteservers Requests',
                    data: requestsData,
                    color: colors.accent.blue,
                    limit: selectedTier?.rps,
                    limitLabel: 'Limit'
                },
                {
                    title: 'Liteservers Connections',
                    data: connectionsData,
                    color: colors.accent.green
                }
            ]}
        />
    );
};

export default LiteproxyStatsModal;
