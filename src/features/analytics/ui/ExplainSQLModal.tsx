import { FunctionComponent } from 'react';
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
import { CopyPad, H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { analyticsQuerySQLRequestStore } from 'src/features';

const ExplainSQLModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Explain</H4>
                </ModalHeader>
                <ModalBody py="0">
                    <CopyPad
                        text={analyticsQuerySQLRequestStore.request$.value?.explanation || ''}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(ExplainSQLModal);
