import { ComponentProps, FC } from 'react';
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
import { CURRENCY, H2, InfoTooltip, DoneIconCircle24, toDate } from 'src/shared';
import { RestApiSelectedTier, RestApiTier } from '../model';
import { CurrencyRate } from 'src/entities';

export const RestApiTierCard: FC<
    CardProps & {
        tier: RestApiTier | RestApiSelectedTier;
        tonPriceStyles?: ComponentProps<typeof Text>;
        onChoseTier?: (tier: RestApiTier) => void;
        isChosen?: boolean;
    }
> = ({ tier, tonPriceStyles, isChosen = false, onChoseTier, ...rest }) => (
    <Card
        direction={{ base: 'column', md: 'row' }}
        gap="6"
        display={'flex'}
        p="6"
        pt="5"
        size="xl"
        {...rest}
    >
        <Flex direction="column" minW="109px">
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
                            {tier.rps} requests per second
                            {tier.price.amount.isZero() && (
                                <>
                                    &nbsp;
                                    <InfoTooltip>
                                        {tier.rps} request per second
                                        for requests with free api token, 0.25 requests per second
                                        for requests without api token
                                    </InfoTooltip>
                                </>
                            )}
                        </Box>
                    </ListItem>
                </List>
            </Flex>
            {onChoseTier && (
                <Flex mt="4">
                    {isChosen ? (
                        // hidden until date if tier is free
                        !tier.price.amount.eq(0) && (
                            <Text textStyle="body2" color="text.secondary">
                                Available until{' '}
                                {'renewsDate' in tier && tier.renewsDate
                                    ? toDate(tier.renewsDate)
                                    : 'unknown'}
                            </Text>
                        )
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
