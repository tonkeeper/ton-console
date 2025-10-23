import { FC, useEffect } from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import RefillModalContent from 'src/entities/balance/ui/RefillModalContent';
import { balanceStore } from 'src/shared/stores';

const RefillModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = props => {
    useEffect(() => {
        if (props.isOpen) {
            balanceStore.fetchDepositAddress();
        }
    }, [props.isOpen]);

    return (
        <Modal scrollBehavior="inside" size="md" {...props}>
            <ModalOverlay />
            <RefillModalContent onClose={props.onClose} />
        </Modal>
    );
};

export default observer(RefillModal);
