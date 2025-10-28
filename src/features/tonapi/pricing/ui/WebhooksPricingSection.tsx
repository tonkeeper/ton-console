import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
    Text,
    Box,
    Card,
    CardHeader,
    CardBody,
    Input,
    Flex,
    Grid,
    Button,
    Badge
} from '@chakra-ui/react';
import { UsdCurrencyAmount } from 'src/shared';
import { WebhookTiers, calculateExpectedPrice } from '../utils/calculating';

export const PricingDiagram = () => {
    return (
        <Grid gap={3}>
            <Box>
                <Text textStyle="label2" pb={2} fontWeight={600}>
                    Subscribed accounts
                </Text>
                <Grid gap="1px" templateColumns="repeat(3, 1fr)">
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#6C727E"
                        borderLeftRadius="md"
                    >
                        ${WebhookTiers.accounts[0].price}
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#9EA4B0"
                    >
                        ${WebhookTiers.accounts[1].price}
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        pl="30px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bgGradient="linear(to-r, #C6CCD8 50%, transparent 100%)"
                        borderRightRadius="md"
                    >
                        ${WebhookTiers.accounts[2].price}
                    </Box>
                    <Text color="text.secondary" variant="body2">
                        million
                    </Text>
                    <Text ml="-4px" color="text.secondary" variant="body2">
                        1
                    </Text>
                    <Text ml="-10px" color="text.secondary" variant="body2">
                        10
                    </Text>
                </Grid>
            </Box>

            <Box>
                <Text textStyle="label2" pb={2} fontWeight={600}>
                    Number of messages sent
                </Text>
                <Grid gap="1px" templateColumns="repeat(3, 1fr)">
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#6C727E"
                        borderLeftRadius="md"
                    >
                        ${WebhookTiers.messages[0].price}
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#9EA4B0"
                    >
                        ${WebhookTiers.messages[1].price}
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bgGradient="linear(to-r, #C6CCD8 50%, transparent 100%)"
                        borderRightRadius="md"
                    >
                        ${WebhookTiers.messages[2].price}
                    </Box>
                    <Text color="text.secondary" variant="body2">
                        million
                    </Text>
                    <Text ml="-4px" color="text.secondary" variant="body2">
                        1
                    </Text>
                    <Text ml="-10px" color="text.secondary" variant="body2">
                        10
                    </Text>
                </Grid>
            </Box>
        </Grid>
    );
};

export const WebhooksPricingCalculator = () => {
    const [accounts, setAccounts] = useState<number | null>(null);
    const [messages, setMessages] = useState<number | null>(null);

    const parseIntInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: number | null) => void
    ) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value ? parseInt(value) : null);
        }
    };

    const currentPrice = new UsdCurrencyAmount(calculateExpectedPrice(accounts, messages));
    return (
        <Card w="100%">
            <CardHeader>
                <Text textStyle="text.label2" fontWeight={600}>
                    Pricing Calculator
                </Text>
            </CardHeader>
            <CardBody flexDir="column" gap="16px" display="flex">
                <Input
                    bg="white"
                    border="1px solid #83898F52"
                    onChange={e => parseIntInput(e, setAccounts)}
                    placeholder="Subscribed accounts"
                    value={accounts ?? ''}
                />
                <Input
                    bg="white"
                    border="1px solid #83898F52"
                    onChange={e => parseIntInput(e, setMessages)}
                    placeholder="Number of messages sent"
                    value={messages ?? ''}
                />
                <Flex justify="space-between">
                    <Text textStyle="body2" color="text.secondary">
                        Estimated month price
                    </Text>
                    <Text textStyle="label" fontWeight={600}>
                        {currentPrice.stringCurrencyAmount}
                    </Text>
                </Flex>
            </CardBody>
        </Card>
    );
};

export const WebhooksPricingSection: FC = observer(() => {
    const navigate = useNavigate();

    const handleActivateWebhooks = () => {
        navigate('../webhooks');
    };

    return (
        <Box>
            <Flex align="baseline" gap="3" mb="4">
                <Text textStyle="h4" fontWeight={600}>
                    Webhooks
                </Text>
                <Badge fontSize="xs" colorScheme="gray">
                    Inactive
                </Badge>
            </Flex>

            <Flex align="flex-start" direction={{ base: 'column', lg: 'row' }} gap="6">
                <Box flex="1" w={{ base: '100%', lg: '50%' }}>
                    <Text textStyle="body2" mb="3" color="text.secondary">
                        Usage-based pricing. Charged hourly for connected accounts and per message
                        sent. Use the calculator to estimate your monthly costs.
                    </Text>
                    <PricingDiagram />
                </Box>
                <Box w={{ base: '100%', lg: '308px' }}>
                    <WebhooksPricingCalculator />
                    <Button w="100%" mt="4" onClick={handleActivateWebhooks} variant="primary">
                        Activate Webhooks
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
});
