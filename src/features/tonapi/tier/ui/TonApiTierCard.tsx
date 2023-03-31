import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { H2, TickIcon, toDate } from 'src/shared';
import { ITonApiSubscription, TonApiTier } from '../model';

export const TonApiTierCard: FunctionComponent<
    ComponentProps<typeof Card> & {
        tier: TonApiTier;
        button: ReactNode;
        subscription?: ITonApiSubscription;
    }
> = ({ tier, button, subscription, ...rest }) => {
    return (
        <Card {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    {tier.name}
                </Text>
            </CardHeader>
            <CardBody flexDir="column" display="flex">
                <H2>{tier.price.stringCurrencyAmount}</H2>
                <Text textStyle="body2" mb="4" color="text.secondary">
                    per month
                </Text>
                <List flex="1" mb="6" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Text textStyle="body2" color="text.primary">
                            {tier.description.requestsPerSecondLimit} requests per second
                        </Text>
                    </ListItem>
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Text textStyle="body2" color="text.primary">
                            {tier.description.connections.subscriptionsLimit} subscription
                            connection up to {tier.description.connections.accountsLimit} accounts
                        </Text>
                    </ListItem>
                </List>
                {subscription && (
                    <Text textStyle="body2" color="text.secondary">
                        Available until {toDate(subscription.renewsDate)}
                    </Text>
                )}
            </CardBody>
            <CardFooter>{button}</CardFooter>
        </Card>
    );
};
