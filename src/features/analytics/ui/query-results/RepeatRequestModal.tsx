import { FunctionComponent, useId, useState } from 'react';
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
import { H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { analyticsQueryStore } from '../../model';
import RepeatRequestModalContent from 'src/features/analytics/ui/query-results/RepeatRequestModalContent';
import { toJS } from 'mobx';

const RepeatRequestModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const formId = useId();
    const [isDirty, setIsDirty] = useState(false);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Repeat Request</H4>
                </ModalHeader>
                <ModalBody py="0">
                    {isOpen && (
                        <RepeatRequestModalContent
                            query={toJS(analyticsQueryStore.query$.value!)}
                            onIsDirtyChange={setIsDirty}
                            formId={formId}
                            onClose={onClose}
                        />
                    )}
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={analyticsQueryStore.isQueryIntervalUpdateLoading}
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

export default observer(RepeatRequestModal);
