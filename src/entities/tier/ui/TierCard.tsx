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
import { H2, TickIcon } from 'src/shared';
import { Tier } from 'src/entities';

export const TierCard: FunctionComponent<
    ComponentProps<typeof Card> & { tier: Tier; button: ReactNode }
> = ({ tier, button, ...rest }) => {
    return (
        <Card {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    {tier.name}
                </Text>
            </CardHeader>
            <CardBody>
                <H2>{tier.tonPrice} TON</H2>
                <Text textStyle="body2" mb="4" color="text.secondary">
                    per month
                </Text>
                <List mb="6" spacing="2">
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
            </CardBody>
            <CardFooter>{button}</CardFooter>
        </Card>
    );
};
