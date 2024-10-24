import { ComponentProps, FC, ReactNode } from 'react';
import {
    Box,
    Button,
    Card,
    CardProps,
    Flex,
    List,
    ListIcon,
    ListItem,
    Stack,
    Text
} from '@chakra-ui/react';
import { CURRENCY, H2, InfoTooltip, Span, DoneIconCircle24, toDate } from 'src/shared';
import { TonApiSelectedTier, TonApiTier } from '../model';
import { CurrencyRate } from 'src/entities';

export const TonApiTierCard: FC<
    CardProps & {
        tier: TonApiTier | TonApiSelectedTier;
        tonPriceStyles?: ComponentProps<typeof Text>;
        zeroTonPricePlaceholder?: ReactNode;
        onChoseTier?: (tier: TonApiTier) => void;
        isChosen?: boolean;
    }
> = ({ tier, tonPriceStyles, zeroTonPricePlaceholder, isChosen = false, onChoseTier, ...rest }) => (
    <Card
        direction={{ base: 'column', md: 'row' }}
        gap="6"
        display={'flex'}
        p="6"
        pt="5"
        size="xl"
        {...rest}
    >
        <Flex direction="column" w="109px">
            <Text textStyle="label2" color="text.primary">
                {tier.name}
            </Text>

            <H2>{tier.price.stringCurrencyAmount}</H2>
            <CurrencyRate
                textStyle="body2"
                color="text.secondary"
                mb="4"
                currency={CURRENCY.TON}
                amount={tier.price.amount}
                reverse
                {...tonPriceStyles}
            >
                &nbsp;TON monthly
            </CurrencyRate>
        </Flex>
        <Stack spacing={0}>
            <Flex direction="column">
                <List flex="1" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={DoneIconCircle24} color="accent.green" />
                        <Box textStyle="body2" color="text.primary">
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
                        </Box>
                    </ListItem>
                    <ListItem display="flex">
                        <ListIcon as={DoneIconCircle24} color="accent.green" />
                        <Box textStyle="body2" color="text.primary">
                            {tier.description.realtimeConnectionsLimit} realtime connections&nbsp;
                            <Span whiteSpace="nowrap">
                                <InfoTooltip>
                                    Subscribe to any TON account changes using server sent events or
                                    websockets
                                </InfoTooltip>
                            </Span>
                        </Box>
                    </ListItem>
                    <ListItem display="flex">
                        <ListIcon as={DoneIconCircle24} color="accent.green" />
                        <Box textStyle="body2" color="text.primary">
                            Watch up to {tier.description.entitiesPerRealtimeConnectionLimit}{' '}
                            accounts for each connection
                        </Box>
                    </ListItem>
                    {tier.description.mempool && (
                        <ListItem display="flex">
                            <ListIcon as={DoneIconCircle24} color="accent.green" />
                            <Box textStyle="body2" color="text.primary">
                                mempool events{' '}
                                <Span whiteSpace="nowrap">
                                    streaming&nbsp;
                                    <InfoTooltip>
                                        Get access to the TON blockchain mempool
                                    </InfoTooltip>
                                </Span>
                            </Box>
                        </ListItem>
                    )}
                </List>
            </Flex>
            {onChoseTier && (
                <Flex mt="4">
                    {isChosen ? (
                        <Text textStyle="body2" color="text.secondary">
                            Available until{' '}
                            {'renewsDate' in tier && tier.renewsDate
                                ? toDate(tier.renewsDate)
                                : 'unknown'}
                        </Text>
                    ) : (
                        <Button
                            isLoading={false}
                            onClick={() => onChoseTier(tier)}
                            size="sm"
                            variant="primary"
                        >
                            Choose {tier.name}
                        </Button>
                    )}
                </Flex>
            )}
        </Stack>
    </Card>
);
