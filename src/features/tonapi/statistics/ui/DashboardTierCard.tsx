import { FC } from 'react';
import { RestApiSelectedTier } from '../../pricing';
import {
    Card,
    CardBody,
    CardHeader,
    CardProps,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { TickIcon, toDate } from 'src/shared';

export const DashboardTierCard: FC<{ tier: RestApiSelectedTier } & CardProps> = ({
    tier,
    ...rest
}) => {
    return (
        <Card {...rest}>
            <CardHeader display="flex">
                <Text textStyle="label1" flex="1" color="text.primary">
                    {tier?.name || 'Free'}
                </Text>
                {tier?.renewsDate && (
                    <Text textStyle="body3" color="text.secondary">
                        Available until {toDate(tier.renewsDate)}
                    </Text>
                )}
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
