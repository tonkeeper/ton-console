import { FC, useMemo } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared/ui/icons/TonConsoleIcon';
import { H4 } from 'src/shared/ui/typography';
import { maintenanceConfig } from 'src/shared/config/maintenance';
import { useLogoutMutation } from 'src/entities/user/queries';

function formatEndTime(isoString: string): string {
    const date = new Date(isoString);

    const local = date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const utc = date.toLocaleString('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });

    return `${local} (${utc} UTC)`;
}

export const MaintenancePage: FC = () => {
    const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

    const estimatedEnd = useMemo(() => {
        const { estimatedEndTime } = maintenanceConfig;
        if (!estimatedEndTime) {
            return null;
        }
        return formatEndTime(estimatedEndTime);
    }, []);

    return (
        <Flex
            align="center"
            justify="center"
            direction="column"
            h="100vh"
            px={4}
            bgColor="background.page"
        >
            <Flex align="center" gap={2} mb={10}>
                <TonConsoleIcon w="40px" h="40px" />
                <H4>Ton Console</H4>
            </Flex>

            <Box textStyle="h2" mb={4} color="text.primary">
                Under Maintenance
            </Box>

            <Text sx={{ textWrap: 'balance' }} textStyle="body1" maxW="480px" mb={2} color="text.secondary" textAlign="center">
                {maintenanceConfig.message ??
                    'We are performing scheduled maintenance. The service will be back shortly.'}
            </Text>

            {estimatedEnd && (
                <Text textStyle="body2" mb={8} color="text.tertiary">
                    Expected back by {estimatedEnd}
                </Text>
            )}

            {!estimatedEnd && <Box mb={8} />}

            <Button
                isLoading={isLoggingOut}
                onClick={() => logout()}
                size="sm"
                variant="outline"
            >
                Log out
            </Button>
        </Flex>
    );
};
