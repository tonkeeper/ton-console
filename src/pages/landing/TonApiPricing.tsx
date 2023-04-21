import { ComponentProps, FunctionComponent } from 'react';
import { Box, Grid, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { CURRENCY, H2, H3Thin, TickIcon } from 'src/shared';
import { CurrencyRate } from 'src/entities';

const tiers = [
    {
        name: 'Start',
        tonPrice: 'FREE',
        usdPriceStub: 'Forever',
        included: {
            requestsPerSecondLimit: 0.25,
            subscription: {
                connectionsLimit: 1,
                accountsLimit: 5
            },
            webhooks: false
        }
    },
    {
        name: 'Lite',
        tonPrice: '1',
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
        tonPrice: '20',
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
        tonPrice: '200',
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

export const TonApiPricing: FunctionComponent<ComponentProps<typeof Grid>> = props => {
    return (
        <Grid
            gap="4"
            {...props}
            justify="center"
            templateColumns="repeat(4, 1fr)"
            w="100%"
            gridTemplate={{
                base: 'auto / 1fr',
                lg: '1fr 1fr / 1fr 1fr',
                xl: '1fr / repeat(4, 1fr)'
            }}
        >
            {tiers.map(tier => (
                <Box
                    key={tier.name}
                    px="6"
                    py="5"
                    borderRadius="lg"
                    bgColor="background.contentTint"
                >
                    <Text textStyle="label2" mb="3" color="text.primary">
                        {tier.name}
                    </Text>
                    <H2 mb="1">
                        {tier.tonPrice === 'FREE' ? tier.tonPrice : `${tier.tonPrice} TON`}
                    </H2>
                    {tier.usdPriceStub ? (
                        <H3Thin mb="4" color="text.secondary">
                            {tier.usdPriceStub}
                        </H3Thin>
                    ) : (
                        <CurrencyRate
                            as={H3Thin}
                            mb="4"
                            textStyle="h3Thin"
                            color="text.secondary"
                            currency={CURRENCY.TON}
                            amount={tier.tonPrice}
                        >
                            &nbsp;per month
                        </CurrencyRate>
                    )}

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
        </Grid>
    );
};
