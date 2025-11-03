import { FC, ReactNode } from 'react';
import { Box, BoxProps, Flex, Skeleton } from '@chakra-ui/react';
import { formatWithSuffix, InfoTooltip, Span } from 'src/shared';
import { useDappsQuery } from 'src/entities/dapp/model/queries';
import { useStatsQuery, useMessagesBalanceQuery } from 'src/features/app-messages/model/queries';

interface StatItemProps {
    label: string;
    tooltip: string;
    value: ReactNode;
    isLoading: boolean;
}

const StatItem: FC<StatItemProps> = ({ label, tooltip, value, isLoading }) => (
    <Flex justify="space-between" gap="2">
        <Box>
            <Span textStyle="body2" color="text.secondary">
                {label}
            </Span>
            &nbsp;
            <InfoTooltip>{tooltip}</InfoTooltip>
        </Box>
        <Span textStyle="body2" textAlign="end" alignContent="center">
            {!isLoading ? value ?? 'unknown' : <Skeleton w="100px" h="3" />}
        </Span>
    </Flex>
);

const AppMessagesStats: FC<BoxProps> = props => {
    const { data: dapps } = useDappsQuery();
    const dappId = dapps?.[0]?.id;

    const { data: stats, isLoading: statsLoading } = useStatsQuery(dappId ?? null);
    const { data: amount, isLoading: balanceLoading } = useMessagesBalanceQuery();

    const isLoading = statsLoading || balanceLoading;

    return (
        <Flex direction="column" gap="2" {...props}>
            <StatItem
                label="All users"
                tooltip="All dApp users with login by Tonkeeper and Ton Connect 2.0"
                value={stats?.totalUsers}
                isLoading={isLoading}
            />
            <StatItem
                label="Enable notifications"
                tooltip="Users who have allowed push notifications from your dApp"
                value={stats?.usersWithEnabledNotifications}
                isLoading={isLoading}
            />
            <StatItem
                label="Available messages"
                tooltip="Push messages balance that you can send to your users"
                value={amount !== undefined ? formatWithSuffix(amount) : undefined}
                isLoading={isLoading}
            />
            <StatItem
                label="Sent last 7 days"
                tooltip="Messages with delivered to dApp users last 7 days"
                value={stats?.sentNotificationsLastWeek}
                isLoading={isLoading}
            />
        </Flex>
    );
};

export default AppMessagesStats;
