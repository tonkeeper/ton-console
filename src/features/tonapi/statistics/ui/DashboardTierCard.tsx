import { ComponentProps, FunctionComponent } from 'react';
import { TonApiSelectedTier } from '../../tier';
import { Card, CardBody, CardHeader, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { TickIcon, toDate } from 'src/shared';

export const DashboardTierCard: FunctionComponent<
    { tier: TonApiSelectedTier } & ComponentProps<typeof Card>
> = ({ tier, ...rest }) => {
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
                            {tier.description.requestsPerSecondLimit} requests per second
                        </Text>
                    </ListItem>
                </List>
            </CardBody>
        </Card>
    );
};
