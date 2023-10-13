import { FunctionComponent, useId } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { EditInvoicesProjectForm } from './EditInvoicesProjectForm';
import { H4 } from 'src/shared';
import { invoicesAppStore } from '../models';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

const EditInvoicesProjectModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const id = useId();

    const app = invoicesAppStore.invoicesApp$.value;

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader borderBottom="1px" borderBottomColor="separator.common">
                    <H4>Edit Project</H4>
                    <Text textStyle="body2" color="text.secondary">
                        This information will be displayed in the invoices that you create.
                    </Text>
                </ModalHeader>
                <ModalBody>
                    {!!app && (
                        <EditInvoicesProjectForm
                            defaultValues={toJS(app)}
                            id={id}
                            onSubmit={form =>
                                invoicesAppStore
                                    .editInvoicesApp({ ...form, id: app.id })
                                    .then(onClose)
                            }
                        />
                    )}
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={id}
                        isLoading={invoicesAppStore.editInvoicesApp.isLoading}
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

export default observer(EditInvoicesProjectModal);
