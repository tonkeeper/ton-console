import { FC } from 'react';
import { RestApiSelectedTier } from '../../pricing';
import {
    Card,
    CardBody,
    CardHeader,
    CardProps,
    Flex,
    List,
    ListIcon,
    ListItem,
    Text,
    VStack
} from '@chakra-ui/react';
import { TickIcon, toDate } from 'src/shared';

interface DashboardTierCardProps extends CardProps {
    tier: RestApiSelectedTier | { name?: string; rps: number; renewsDate?: Date | number };
    service?: string;
}

export const DashboardTierCard: FC<DashboardTierCardProps> = ({
    tier,
    service,
    ...rest
}) => {
    const getDisplayDate = (dateOrTimestamp?: Date | number): string | null => {
        if (!dateOrTimestamp) return null;

        if (typeof dateOrTimestamp === 'number') {
            // If it's a timestamp in seconds, convert to milliseconds
            return toDate(new Date(dateOrTimestamp * 1000));
        }

        return toDate(dateOrTimestamp);
    };

    const displayDate = getDisplayDate(tier?.renewsDate);

    return (
        <Card flex="1" minW="250px" maxW="350px" {...rest}>
            <CardHeader p="4">
                <Flex align="flex-start" justify="space-between" gap="2" w="100%">
                    <VStack align="flex-start" spacing="1">
                        {service && (
                            <Text textStyle="body3" color="text.secondary">
                                {service}
                            </Text>
                        )}
                        <Text textStyle="label1" color="text.primary">
                            {tier?.name || 'Free'}
                        </Text>
                    </VStack>
                    {displayDate && (
                        <Text textStyle="body3" color="text.secondary" whiteSpace="nowrap">
                            Available until {displayDate}
                        </Text>
                    )}
                </Flex>
            </CardHeader>
            <CardBody>
                <List flex="1" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="text.primary" />
                        <Text textStyle="body2" color="text.primary">
                            {tier.rps} requests per second
                        </Text>
                    </ListItem>
                </List>
            </CardBody>
        </Card>
    );
};
