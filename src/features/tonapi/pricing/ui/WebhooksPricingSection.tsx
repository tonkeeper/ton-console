import { FC, useState } from 'react';
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
    Badge,
    Center,
    Spinner
} from '@chakra-ui/react';
import { UsdCurrencyAmount, Network } from 'src/shared';
import { useWebhooksQuery } from '../../webhooks/model/queries';
import { WebhookTiers, calculateExpectedPrice } from '../utils/calculating';

export const PricingDiagram: FC<{ isDisabled?: boolean }> = ({ isDisabled = false }) => {
    return (
        <Grid gap={3} opacity={isDisabled ? 0.6 : 1}>
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

export const WebhooksPricingCalculator: FC<{ isDisabled?: boolean }> = ({ isDisabled = false }) => {
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
        <Card flexDir="column" display="flex" w="100%" opacity={isDisabled ? 0.6 : 1}>
            <CardHeader>
                <Text textStyle="text.label2" fontWeight={600}>
                    Pricing Calculator
                </Text>
            </CardHeader>
            <CardBody flexDir="column" gap="16px" display="flex">
                <Input
                    bg="white"
                    border="1px solid #83898F52"
                    isDisabled={isDisabled}
                    onChange={e => !isDisabled && parseIntInput(e, setAccounts)}
                    placeholder="Subscribed accounts"
                    value={accounts ?? ''}
                />
                <Input
                    bg="white"
                    border="1px solid #83898F52"
                    isDisabled={isDisabled}
                    onChange={e => !isDisabled && parseIntInput(e, setMessages)}
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

/**
 * Reusable content component for webhooks pricing section
 * Separates rendering logic from data-fetching concerns
 *
 * Props:
 * - isLoading: Show loading spinner (only when fetching data)
 * - isInactive: Show Inactive badge and Try Webhooks button
 * - onTryWebhooks: Callback for Try Webhooks button
 */
const WebhooksPricingContent: FC<{
    isLoading?: boolean;
    isInactive?: boolean;
    onTryWebhooks?: () => void;
}> = ({ isLoading = false, isInactive = false, onTryWebhooks }) => {
    // Show loading state
    if (isLoading) {
        return (
            <Center py="8">
                <Spinner />
            </Center>
        );
    }

    return (
        <Box>
            {/* Header with optional Inactive badge */}
            <Flex align="baseline" gap="3" mb="4">
                <Text textStyle="h4" fontWeight={600}>
                    Webhooks
                </Text>
                {isInactive && (
                    <Badge fontSize="xs" colorScheme="gray">
                        Inactive
                    </Badge>
                )}
            </Flex>

            {/* Pricing diagram and calculator */}
            <Flex align="flex-start" wrap="wrap" gap="6">
                <Box flex="3 1 300px" minW="300px">
                    <Text textStyle="body2" mb="3" color="text.secondary">
                        Usage-based pricing. Charged hourly for connected accounts and per message
                        sent. Use the calculator to estimate your monthly costs.
                    </Text>
                    <PricingDiagram />
                </Box>
                <Box flex="1 1 308px" minW="280px">
                    <WebhooksPricingCalculator />
                    {isInactive && onTryWebhooks && (
                        <Button w="100%" mt="4" onClick={onTryWebhooks} variant="primary">
                            Try Webhooks
                        </Button>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

interface WebhooksPricingSectionProps {
    displayOnly?: boolean;
}

export const WebhooksPricingSection: FC<WebhooksPricingSectionProps> = ({
    displayOnly = false
}) => {
    // Hooks must be called unconditionally at top level (React hooks rules)
    const navigate = useNavigate();
    const { data: webhooks = [], isLoading, error } = useWebhooksQuery(Network.MAINNET);

    // Display-only mode: render static content without using data-fetching result
    if (displayOnly) {
        return <WebhooksPricingContent />;
    }

    // Normal mode: compute state from fetched data and render with callbacks
    const isWebhooksUnavailable = Boolean(error);
    const isWebhooksInactive = webhooks.length === 0 && !isLoading && !isWebhooksUnavailable;

    return (
        <WebhooksPricingContent
            isLoading={isLoading}
            isInactive={isWebhooksInactive}
            onTryWebhooks={() => navigate('../webhooks')}
        />
    );
};
