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
import { IndexingCnftCollectionDataT, cnftStore } from '../../model/cnft.store';

const CNFTAddModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'cnft-add-form';

    const onSubmit = useCallback(
        (form: IndexingCnftCollectionDataT): void => {
            cnftStore.addCNFT(form).then(() => props.onClose());
        },
        [props.onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add cNFT</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <CNFTAddForm id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
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
