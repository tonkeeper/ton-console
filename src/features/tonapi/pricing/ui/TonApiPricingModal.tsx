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
import { DoneIconCircle24, H4 } from 'src/shared';
import { tonApiTiersStore } from '../model';
import { observer } from 'mobx-react-lite';

const TonApiPricingModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ onClose, isOpen }) => {
    const currentTier = tonApiTiersStore.selectedTier$.value;

    if (!currentTier) {
        return null;
    }

    const tiers: {
        id: number;
        name: string;
        mempool: boolean | null;
        entitiesPerRealtimeConnectionLimit: number | null;
        realtimeConnectionsLimit: string | null;
        requestsPerSecondLimit: string | null;
        price: string;
    }[] = tonApiTiersStore.tiers$.value.map(
        ({
            id,
            price,
            description: {
                requestsPerSecondLimit,
                realtimeConnectionsLimit,
                entitiesPerRealtimeConnectionLimit,
                mempool
            },
            name
        }) => ({
            id,
            name,
            mempool,
            entitiesPerRealtimeConnectionLimit,
            realtimeConnectionsLimit: realtimeConnectionsLimit.toString(),
            requestsPerSecondLimit: requestsPerSecondLimit.toString(),
            price: price.amount.eq(0) ? 'Free' : price.stringCurrencyAmount
        })
    );

    tiers.push({
        id: -1,
        name: 'Custom',
        mempool: null,
        requestsPerSecondLimit: 'Unlimited',
        entitiesPerRealtimeConnectionLimit: null,
        realtimeConnectionsLimit: 'Unlimited',
        price: 'Custom'
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
                                {tiers.map(({ id, requestsPerSecondLimit }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {requestsPerSecondLimit}
                                        </Text>
                                    </Td>
                                ))}
                            </Tr>

                            <Tr>
                                <Td minW={235}>Realtime connections</Td>
                                {tiers.map(({ id, realtimeConnectionsLimit }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {realtimeConnectionsLimit}
                                        </Text>
                                    </Td>
                                ))}
                            </Tr>

                            <Tr>
                                <Td minW={235}>Account Tracking</Td>
                                {tiers.map(({ id, entitiesPerRealtimeConnectionLimit }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {entitiesPerRealtimeConnectionLimit}
                                        </Text>
                                    </Td>
                                ))}
                            </Tr>

                            <Tr>
                                <Td minW={235}>Mempool event streaming</Td>
                                {tiers.map(({ id, mempool }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {mempool && <DoneIconCircle24 width={5} />}
                                            {mempool === false && '-'}
                                            {mempool === null && ''}
                                        </Text>
                                    </Td>
                                ))}
                            </Tr>

                            <Tr>
                                <Td minW={235}>Price</Td>
                                {tiers.map(({ id, price }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2" color="text.secondary">
                                            {price}
                                        </Text>
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
