import { FunctionComponent } from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import RefillModalContent from 'src/entities/balance/ui/RefillModalContent';

const RefillModal: FunctionComponent<{
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

export default observer(RefillModal);
