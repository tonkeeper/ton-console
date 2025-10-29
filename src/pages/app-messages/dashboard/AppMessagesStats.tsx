import { FC } from 'react';
import { Box, BoxProps, Flex, Skeleton } from '@chakra-ui/react';
import { formatWithSuffix, InfoTooltip, Span } from 'src/shared';
import { useDappsQuery } from 'src/entities/dapp/model/queries';
import { useStatsQuery, useBalanceQuery } from 'src/features/app-messages/model/queries';

const AppMessagesStats: FC<BoxProps> = props => {
    const { data: dapps } = useDappsQuery();
    const dappId = dapps?.[0]?.id;

    const { data: stats, isLoading: statsLoading } = useStatsQuery(dappId ?? null);
    const { data: balance, isLoading: balanceLoading } = useBalanceQuery();

    const isLoading = statsLoading || balanceLoading;

    return (
        <Box {...props}>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        All users
                    </Span>
                    &nbsp;
                    <InfoTooltip>
                        All dApp users with login by Tonkeeper and Ton Connect 2.0
                    </InfoTooltip>
                </Box>
                <Span textStyle="body2" textAlign="end">
                    {!isLoading && stats ? stats.totalUsers : <Skeleton w="100px" h="3" />}
                </Span>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        Enable notifications
                    </Span>
                    &nbsp;
                    <InfoTooltip>
                        Users who have allowed push notifications from your dApp
                    </InfoTooltip>
                </Box>
                <Span textStyle="body2" textAlign="end">
                    {!isLoading && stats ? (
                        stats.usersWithEnabledNotifications
                    ) : (
                        <Skeleton w="100px" h="3" />
                    )}
                </Span>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        Available messages
                    </Span>
                    &nbsp;
                    <InfoTooltip>Push messages balance that you can send to your users</InfoTooltip>
                </Box>
                <Span textStyle="body2" textAlign="end">
                    {!isLoading && balance !== undefined ? formatWithSuffix(balance) : <Skeleton w="100px" h="3" />}
                </Span>
            </Flex>
            <Flex justify="space-between">
                <Box mb="2">
                    <Span textStyle="body2" color="text.secondary">
                        Sent last 7 days
                    </Span>
                    &nbsp;
                    <InfoTooltip>Messages with delivered to dApp users last 7 days</InfoTooltip>
                </Box>
                <Span textStyle="body2" textAlign="end">
                    {!isLoading && stats ? stats.sentNotificationsLastWeek : <Skeleton w="100px" h="3" />}
                </Span>
            </Flex>
        </Box>
    );
};

export default AppMessagesStats;
