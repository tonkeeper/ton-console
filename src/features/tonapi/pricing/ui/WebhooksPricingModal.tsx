import { FC, useState } from 'react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Box,
    Card,
    CardHeader,
    CardBody,
    Input,
    Flex,
    Grid
} from '@chakra-ui/react';
import { H4, UsdCurrencyAmount } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { calculateExpectedPrice } from '../utils/calculating';

const PricingDiagram = () => {
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
                        $20
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#9EA4B0"
                    >
                        $5
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
                        $2
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
                        $100
                    </Box>
                    <Box
                        flex="1"
                        p="5px"
                        color="white"
                        fontWeight={600}
                        textAlign="center"
                        bg="#9EA4B0"
                    >
                        $20
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
                        $10
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

const WebhooksPricingCalculator = () => {
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
        <Card
            w={{
                base: '100%',
                md: '308px'
            }}
        >
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

const WebhooksPricingModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ onClose, isOpen }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="4xl">
            <ModalOverlay />
            <ModalContent maxW="930px">
                <ModalHeader>
                    <H4 mb="0">Webhooks pricing</H4>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    flexDir={{
                        base: 'column',
                        md: 'row'
                    }}
                    gap={5}
                    display="flex"
                    py="0"
                >
                    <Box>
                        <Text textStyle="body2" mb="3" color="text.secondary" fontSize={12}>
                            Accounts can be connected and disconnected dynamically, so we charge
                            hourly based on the number of connected accounts. Thus, a million
                            accounts per month becomes 720 million hours. For convenience in
                            estimating costs, the rate is displayed based on accounts per month.
                        </Text>
                        <PricingDiagram />
                    </Box>
                    <Box>
                        <WebhooksPricingCalculator />
                    </Box>
                </ModalBody>

                <ModalFooter pt="0"></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(WebhooksPricingModal);
