import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC, useCallback } from 'react';
import CNFTAddForm from './CNFTAddForm';
import { CNFTStore, IndexingCnftCollectionDataT } from '../../model/cnft.store';

const CNFTAddModal: FC<{ isOpen: boolean; onClose: () => void; cnftStore: CNFTStore }> = props => {
    const formId = 'cnft-add-form';
    const { cnftStore, onClose } = props;

    const onSubmit = useCallback(
        (form: IndexingCnftCollectionDataT): void => {
            cnftStore.addCNFT(form).then(() => onClose());
        },
        [onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add cNFT</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <CNFTAddForm cnftStore={cnftStore} id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={cnftStore.addCNFT.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Buy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(CNFTAddModal);
