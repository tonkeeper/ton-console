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
import { FC, useCallback, useRef } from 'react';
import CNFTAddForm from './CNFTAddForm';
import { useAddCNftMutation, IndexingCnftCollectionDataT } from '../../model/queries';

const CNFTAddModal: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const formId = 'cnft-add-form';
    const { mutate: addCNft, isPending } = useAddCNftMutation();
    const formRef = useRef<HTMLFormElement>(null);

    const onSubmit = useCallback(
        (form: IndexingCnftCollectionDataT): void => {
            addCNft(form, {
                onSuccess: () => {
                    // Reset form before closing
                    formRef.current?.reset();
                    onClose();
                }
            });
        },
        [onClose, addCNft]
    );

    const handleClose = useCallback(() => {
        // Reset form when closing modal
        formRef.current?.reset();
        onClose();
    }, [onClose]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add cNFT</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <CNFTAddForm ref={formRef} id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={handleClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={isPending}
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

export default CNFTAddModal;
