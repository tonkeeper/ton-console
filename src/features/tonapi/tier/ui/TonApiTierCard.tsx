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
import { CURRENCY, H2, TickIcon, toDate } from 'src/shared';
import { isTonApiSelectedTier, TonApiSelectedTier, TonApiTier } from '../model';
import { CurrencyRate } from 'src/entities';

export const TonApiTierCard: FunctionComponent<
    ComponentProps<typeof Card> & {
        tier: TonApiTier | TonApiSelectedTier;
        button: ReactNode;
    }
> = ({ tier, button, ...rest }) => {
    return (
        <Card size="lg" variant="outline" {...rest}>
            <CardHeader>
                <Text textStyle="label2" color="text.primary">
                    {tier.name}
                </Text>
            </CardHeader>
            <CardBody flexDir="column" display="flex">
                {tier.price.amount.isZero() ? (
                    <H2 mb="9">FREE</H2>
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
                        >
                            &nbsp;TON per month
                        </CurrencyRate>
                    </>
                )}
                <List flex="1" mb="6" spacing="2">
                    <ListItem display="flex">
                        <ListIcon as={TickIcon} color="accent.green" />
                        <Text textStyle="body2" color="text.primary">
                            {tier.description.requestsPerSecondLimit} requests per second
                        </Text>
                    </ListItem>
                </List>
                {isTonApiSelectedTier(tier) && tier.renewsDate && (
                    <Text textStyle="body2" color="text.secondary">
                        Available until {toDate(tier.renewsDate)}
                    </Text>
                )}
            </CardBody>
            <CardFooter>{button}</CardFooter>
        </Card>
    );
};
