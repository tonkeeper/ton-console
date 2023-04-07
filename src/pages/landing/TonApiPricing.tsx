import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { H2, TickIcon } from 'src/shared';

const tiers = [
    {
        name: 'Lite',
        price: '1 TON',
        included: {
            requestsPerSecondLimit: 1,
            subscription: {
                connectionsLimit: 1,
                accountsLimit: 5
            },
            webhooks: false
        }
    },
    {
        name: 'Standard',
        price: '20 TON',
        included: {
            requestsPerSecondLimit: 50,
            subscription: {
                connectionsLimit: 10,
                accountsLimit: 50
            },
            webhooks: false
        }
    },
    {
        name: 'Pro',
        price: '200 TON',
        included: {
            requestsPerSecondLimit: 600,
            subscription: {
                connectionsLimit: 100,
                accountsLimit: 50
            },
            webhooks: true
        }
    }
];

export const TonApiPricing: FunctionComponent<ComponentProps<typeof Flex>> = props => {
    return (
        <Flex
            gap="4"
            {...props}
            justify="center"
            direction={{ base: 'column', lg: 'row' }}
            w="100%"
        >
            {tiers.map(tier => (
                <Box
                    key={tier.name}
                    w={{ base: '100%', lg: '310px' }}
                    px="6"
                    py="5"
                    borderRadius="lg"
                    bgColor="background.contentTint"
                >
                    <Text textStyle="label2" mb="3" color="text.primary">
                        {tier.name}
                    </Text>
                    <H2>{tier.price}</H2>
                    <Text textStyle="body2" mb="4" color="text.secondary">
                        per month
                    </Text>
                    <List flex="1" spacing="2">
                        <ListItem display="flex">
                            <ListIcon as={TickIcon} color="accent.green" />
                            <Text textStyle="body2" color="text.primary">
                                {tier.included.requestsPerSecondLimit} requests per second
                            </Text>
                        </ListItem>
                        <ListItem display="flex">
                            <ListIcon as={TickIcon} color="text.secondary" />
                            <Text textStyle="body2" color="text.secondary">
                                {tier.included.subscription.connectionsLimit} subscription
                                connection up to {tier.included.subscription.accountsLimit} accounts
                                (coming soon)
                            </Text>
                        </ListItem>
                        {tier.included.webhooks && (
                            <ListItem display="flex">
                                <ListIcon as={TickIcon} color="text.secondary" />
                                <Text textStyle="body2" color="text.secondary">
                                    Webhooks (coming soon)
                                </Text>
                            </ListItem>
                        )}
                    </List>
                </Box>
            ))}
        </Flex>
    );
};
