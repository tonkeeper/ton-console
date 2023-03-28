import { FunctionComponent } from 'react';
import { Tier } from 'src/entities';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    chakra,
    Flex
} from '@chakra-ui/react';
import { H4, Pad } from 'src/shared';

export const PaymentDetailsModal: FunctionComponent<{
    isOpen: boolean;
    onClose: (confirm?: boolean) => void;
    tier: Tier;
}> = ({ tier, ...rest }) => {
    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Payment Details</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Upgrade to TON API Pro Plan
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Pad mb="4">
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Plan
                            </Text>
                            <Text textStyle="body2" color="text.secondary">
                                {tier.name}
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Included
                            </Text>
                            <Text textStyle="body2" color="text.secondary" textAlign="right">
                                {tier.description.requestsPerSecondLimit} requests per second,{' '}
                                {tier.description.connections.subscriptionsLimit} subscription
                                connection up to {tier.description.connections.accountsLimit}
                                 accounts, webhooks
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Period
                            </Text>
                            <Text textStyle="body2" color="text.secondary">
                                Monthly
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Price
                            </Text>
                            <Text textStyle="body2" color="text.secondary">
                                {tier.tonPrice}
                            </Text>
                        </Flex>
                    </Pad>
                    <Text textStyle="body3" color="text.secondary">
                        Your plan will renew automatically every month until cancelled. When you
                        switch to a different tariff plan, any{' '}
                        <chakra.span color="text.primary">
                            {' '}
                            payment you&apos;ve already made for the current month will be
                            forfeited.
                        </chakra.span>
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => rest.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} onClick={() => rest.onClose(true)} variant="primary">
                        Confirm Purchase
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
