import { FC } from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import RefillModalContent from 'src/entities/balance/ui/RefillModalContent';

const RefillModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = props => {
    return (
        <Modal scrollBehavior="inside" size="md" {...props}>
            <ModalOverlay />
            <RefillModalContent onClose={props.onClose} />
        </Modal>
    );
};

export default RefillModal;
