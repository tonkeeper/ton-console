import { FunctionComponent } from 'react';
import { H2, Overlay } from 'src/shared';
import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { RefillModal } from 'src/features';

const BalancePage: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <>
            <Overlay h="fit-content">
                <H2 mb="1">0 TON</H2>
                <Text textStyle="body2" mb="5" color="text.secondary">
                    0 USD
                </Text>
                <Button onClick={onOpen} size="lg">
                    Refill
                </Button>
            </Overlay>
            <RefillModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default BalancePage;
