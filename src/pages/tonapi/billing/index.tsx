import { FunctionComponent, useState } from 'react';
import {
    Button,
    Divider,
    Flex,
    List,
    ListIcon,
    ListItem,
    Select,
    useDisclosure
} from '@chakra-ui/react';
import { H2, H3, H4, TickIcon } from 'src/shared';
import { LatestPayment } from 'src/pages/tonapi/billing/LatestPayment';
import { PaymentModal } from 'src/pages/tonapi/billing/PaymentModal';

const BillingPage: FunctionComponent = () => {
    const [selectedPlan, setSelectedPlan] = useState('Basic');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const paymentAmount = 50;

    return (
        <Flex align="flex-start" direction="column" w="500px" mx="auto" pt="4" px="3">
            <H2 mb={6} alignSelf="center">
                Billing
            </H2>
            <LatestPayment mb={7} />
            <Divider mb={7} borderColor="black" />
            <Flex gap="8" mb={6}>
                <H3>Select your plan:</H3>
                <Select
                    w="200px"
                    onChange={e => setSelectedPlan(e.target.value)}
                    value={selectedPlan}
                >
                    <option value="Basic">Basic</option>
                </Select>
            </Flex>
            <H4 mb={4}>
                {selectedPlan} plan price: {paymentAmount} TON / month
            </H4>
            <H4 mb={2}>{selectedPlan} plan includes</H4>
            <List mb={8}>
                <ListItem>
                    <ListIcon as={TickIcon} color="accent.green" />
                    100 000 TON API requests
                </ListItem>
                <ListItem>
                    <ListIcon as={TickIcon} color="accent.green" />
                    24/7 support
                </ListItem>
            </List>
            <Flex gap={3} w="100%" mb={10}>
                <Button onClick={onOpen}>Pay now</Button>
                <Button variant="secondary">Contact Support</Button>
            </Flex>
            <PaymentModal amount={paymentAmount} size="md" isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default BillingPage;
