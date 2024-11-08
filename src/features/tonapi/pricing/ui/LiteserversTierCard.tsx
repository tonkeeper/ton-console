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
import {
    CURRENCY,
    H2,
    DoneIconCircle24,
    toDate,
    DTOLiteproxyTier,
    UsdCurrencyAmount,
    DTOProjectLiteproxyTierDetail
} from 'src/shared';
import { CurrencyRate } from 'src/entities';

export const LiteserversTierCard: FC<
    CardProps & {
        tier: DTOLiteproxyTier | DTOProjectLiteproxyTierDetail;
        tonPriceStyles?: ComponentProps<typeof Text>;
        zeroTonPricePlaceholder?: ReactNode;
        onChoseTier?: (tier: DTOLiteproxyTier) => void;
        isChosen?: boolean;
    }
> = ({ tier, tonPriceStyles, zeroTonPricePlaceholder, isChosen = false, onChoseTier, ...rest }) => {
    const price = new UsdCurrencyAmount(tier.usd_price);
    return (
        <Card
            direction={{ base: 'column', md: 'row' }}
            gap="6"
            display={'flex'}
            p="6"
            pt="5"
            size="xl"
            {...rest}
        >
            <Flex direction="column" w="140px">
                <Text textStyle="label2" color="text.primary">
                    {tier.name}
                </Text>

                <H2>{price.stringCurrencyAmount}</H2>
                <CurrencyRate
                    textStyle="body2"
                    color="text.secondary"
                    currency={CURRENCY.TON}
                    amount={price.amount}
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
                            </Box>
                        </ListItem>
                    </List>
                </Flex>
                {onChoseTier && (
                    <Flex mt="4">
                        {isChosen ? (
                            // hidden until date if tier is free
                            !price.amount.eq(0) && (
                                <Text textStyle="body2" color="text.secondary">
                                    Available until{' '}
                                    {'next_payment' in tier && tier.next_payment
                                        ? toDate(new Date(tier.next_payment))
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
};
