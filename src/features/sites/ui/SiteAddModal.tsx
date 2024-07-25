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
import SiteAddForm from './SiteAddForm';
import { Site, sitesStore } from '../model/sites.store';
import { useNavigate } from 'react-router-dom';

const SiteAddModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'site-add-form';
    const navigate = useNavigate();

    const onSubmit = useCallback((form: Site): void => {
        sitesStore.addSite(form).then(() => navigate(form.domain));
    }, []);

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent maxW={480}>
                <ModalHeader>Add Domain</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <SiteAddForm id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={sitesStore.addSite.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(SiteAddModal);
