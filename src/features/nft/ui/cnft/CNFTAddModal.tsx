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
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CNFTAddForm, type IndexingCnftCollectionDataT } from './CNFTAddForm';

const CNFTAddModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'cnft-add-form';

    const methods = useForm<IndexingCnftCollectionDataT>({});

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add cNFT</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <FormProvider {...methods}>
                        <CNFTAddForm id={formId} onSubmit={() => {}} />
                    </FormProvider>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} form={formId} type="submit" variant="primary">
                        Buy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(CNFTAddModal);
