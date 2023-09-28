import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    List,
    ListIcon,
    ListItem,
    Text
} from '@chakra-ui/react';
import { CURRENCY, H2, InfoTooltip, Span, TickIcon, toDate } from 'src/shared';
import { isTonApiSelectedTier, TonApiSelectedTier, TonApiTier } from '../model';
import { CurrencyRate } from 'src/entities';

export const TonApiTierCard: FunctionComponent<
    ComponentProps<typeof Card> & {
        tier: TonApiTier | TonApiSelectedTier;
        button?: ReactNode;
        tonPriceStyles?: ComponentProps<typeof Text>;
        zeroTonPricePlaceholder?: ReactNode;
    }
> = ({ tier, button, tonPriceStyles, zeroTonPricePlaceholder, ...rest }) => {
    return (
        <Card size="lg" variant="outline" {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    {tier.name}
                </Text>
            </CardHeader>
            <CardBody flexDir="column" display="flex">
                {tier.price.amount.isZero() ? (
                    <>
                        <H2 mb={zeroTonPricePlaceholder ? '0' : '9'}>FREE</H2>
                        {zeroTonPricePlaceholder}
                    </>
                ) : (
                    <>
                        <H2>{tier.price.stringCurrencyAmount}</H2>
                        <CurrencyRate
                            textStyle="body2"
                            mb="4"
                            leftSign=""
                            color="text.secondary"
                            currency={CURRENCY.TON}
                            amount={tier.price.amount}
                            reverse
                            {...tonPriceStyles}
                        >
                            &nbsp;TON per month
                        </CurrencyRate>
                    </>
                )}
                <List flex="1" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Text textStyle="body2" color="text.primary">
                            {tier.description.requestsPerSecondLimit} requests per second
                            {tier.price.amount.isZero() && (
                                <>
                                    &nbsp;
                                    <InfoTooltip>
                                        {tier.description.requestsPerSecondLimit} request per second
                                        for requests with free api token, 0.25 requests per second
                                        for requests without api token
                                    </InfoTooltip>
                                </>
                            )}
                        </Text>
                    </ListItem>
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Text as={Box} textStyle="body2" color="text.primary">
                            {tier.description.realtimeConnectionsLimit} realtime connections, watch
                            up to {tier.description.entitiesPerRealtimeConnectionLimit} accounts for
                            each{' '}
                            <Span whiteSpace="nowrap">
                                connection&nbsp;
                                <InfoTooltip>
                                    Subscribe to any TON account changes using server sent events or
                                    websockets
                                </InfoTooltip>
                            </Span>
                        </Text>
                    </ListItem>
                    {tier.description.mempool && (
                        <ListItem display="flex">
                            <ListIcon as={TickIcon} color="accent.green" />
                            <Text as={Box} textStyle="body2" color="text.primary">
                                event streaming from{' '}
                                <Span whiteSpace="nowrap">
                                    mempool&nbsp;
                                    <InfoTooltip>
                                        Get access to the TON blockchain mempool
                                    </InfoTooltip>
                                </Span>
                            </Text>
                        </ListItem>
                    )}
                </List>
                {isTonApiSelectedTier(tier) && tier.renewsDate && (
                    <Text textStyle="body2" mt="3" color="text.secondary">
                        Available until {toDate(tier.renewsDate)}
                    </Text>
                )}
            </CardBody>
            {!!button && <CardFooter>{button}</CardFooter>}
        </Card>
    );
};
