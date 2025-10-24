import { FC, useId } from 'react';
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
import { EditInvoicesProjectForm } from './EditInvoicesProjectForm';
import { H4 } from 'src/shared';
import { invoicesAppStore, InvoicesProjectForm } from '../models';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

const EditInvoicesProjectModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const id = useId();

    const app = invoicesAppStore.invoicesApp$.value;

    const stuctApp = toJS(app);

    const defaultValues: Partial<InvoicesProjectForm> | undefined = stuctApp
        ? {
              ...stuctApp,
              receiverAddress: stuctApp.receiverAddress.userFriendly
          }
        : undefined;

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Edit Project</H4>
                </ModalHeader>
                <ModalBody py="0">
                    {!!app && (
                        <EditInvoicesProjectForm
                            defaultValues={defaultValues}
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
