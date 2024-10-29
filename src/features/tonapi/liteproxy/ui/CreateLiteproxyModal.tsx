import { FC } from 'react';
import {
    Button,
    Modal,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { liteproxysStore } from '../model';

const CreateLiteproxyModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const onSubmit = () => liteproxysStore.createLiteproxy().then(props.onClose);

    return (
        <Modal scrollBehavior="inside" {...props} size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Liteproxy?</ModalHeader>
                {/* <ModalCloseButton /> */}

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={liteproxysStore.createLiteproxy.isLoading}
                        onClick={onSubmit}
                        type="submit"
                        variant="primary"
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(CreateLiteproxyModal);
