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
import { DTOLiteproxyTier, H4, UsdCurrencyAmount } from 'src/shared';
import { observer } from 'mobx-react-lite';

const LiteserversPricingModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    tiers: DTOLiteproxyTier[];
    currentTier: DTOLiteproxyTier | null;
}> = ({ tiers, currentTier, onClose, isOpen }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Liteservers plans</H4>
                    <Text textStyle="body2" color="text.secondary">
                        You are currently{' '}
                        {currentTier ? `using the ${currentTier.name} plan` : 'not using any plan'}
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
                                {tiers.map(({ id, usd_price }) => (
                                    <Td key={id}>
                                        <Text textStyle="body2">
                                            {new UsdCurrencyAmount(usd_price).stringCurrencyAmount}
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

export default observer(LiteserversPricingModal);
