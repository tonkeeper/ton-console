import { FC } from 'react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { restApiTiersStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';

interface Tier {
    id: number;
    name: string;
    rps: string;
    price: string;
    type: 'monthly' | 'pay-as-you-go' | null;
}

const TonApiPricingModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ onClose, isOpen }) => {
    const currentTier = restApiTiersStore.selectedTier$.value;

    if (!currentTier) {
        return null;
    }

    const tiers: Tier[] = restApiTiersStore.tiers$.value.map(({ price, rps, ...rest }) => ({
        ...rest,
        rps: rps.toString(),
        price: price.amount.eq(0) ? 'Free' : price.stringCurrencyAmount
    }));

    tiers.push({
        id: -1,
        name: 'Custom',
        rps: 'Unlimited',
        price: 'Custom',
        type: null
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">REST API plans</H4>
                    <Text textStyle="body2" color="text.secondary">
                        You are currently using the {currentTier.name} plan
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Table variant="whiteBackground">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                {tiers.map(tier => (
                                    <Th key={tier.id}>
                                        <Text textStyle="label1" color="text.primary">
                                            {tier.name}
                                        </Text>
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td minW={235}>Requests per sec</Td>
                                {tiers.map(({ id, rps }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {rps}
                                        </Text>
                                    </Td>
                                ))}
                            </Tr>

                            <Tr>
                                <Td minW={235}>Price</Td>
                                {tiers.map(({ id, price }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2">{price}</Text>
                                    </Td>
                                ))}
                            </Tr>
                        </Tbody>
                    </Table>
                </ModalBody>

                <ModalFooter pt="0"></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(TonApiPricingModal);
