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
import { analyticsQueryGPTRequestStore, analyticsQuerySQLRequestStore } from 'src/features';

const ExplainSQLModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    type: 'sql' | 'gpt';
}> = ({ isOpen, onClose, type }) => {
    const text =
        (type === 'sql'
            ? analyticsQuerySQLRequestStore.request$.value?.explanation
            : analyticsQueryGPTRequestStore.request$.value?.explanation) || '';
    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="5xl">
            <ModalOverlay />
            <ModalContent mx="30px">
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Explain</H4>
                </ModalHeader>
                <ModalBody py="0">
                    <CopyPad minW="fit-content" whiteSpace="pre" text={text} />
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
