import { FC } from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import MessagesPaymentConfirmationModalContent from './MessagesPaymentConfirmationModalContent';
import { AppMessagesPackage } from '../model';

export const MessagesPaymentConfirmationModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    pkg: AppMessagesPackage;
}> = ({ pkg, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <MessagesPaymentConfirmationModalContent onClose={onClose} pkg={pkg} />
        </Modal>
    );
};
