import { FC, useCallback, useEffect } from 'react';
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
import { webhooksStore } from '../model';
import { FormProvider, useForm } from 'react-hook-form';
import { SubscriptionsForm } from './SubscriptionsForm';
import { AddSubscriptionsForm } from '../model/interfaces/add-subscriptions-form';

const AddSubscriptionsModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'add-subscription-form';

    const methods = useForm<AddSubscriptionsForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: AddSubscriptionsForm): void => {
            webhooksStore.addSubscriptions(form.accounts).then(props.onClose);
        },
        [props.onClose]
    );

    useEffect(() => {
        if (!props.isOpen) {
            setTimeout(reset, 200);
        }
    }, [reset, props.isOpen]);

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Subscription</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <SubscriptionsForm id={formId} onSubmit={onSubmit} />
                    </FormProvider>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={webhooksStore.addSubscriptions.isLoading}
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

export default observer(AddSubscriptionsModal);
