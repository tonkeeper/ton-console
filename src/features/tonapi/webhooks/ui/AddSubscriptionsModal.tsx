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
import { useAddSubscriptionsMutation, useWebhooksUI } from '../model';
import { FormProvider, useForm } from 'react-hook-form';
import { SubscriptionsForm } from './SubscriptionsForm';
import { AddSubscriptionsForm } from '../model/interfaces/add-subscriptions-form';

const AddSubscriptionsModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'add-subscription-form';
    const { selectedWebhookId, network } = useWebhooksUI();
    const { mutate: addSubscriptions, isPending } = useAddSubscriptionsMutation(
        selectedWebhookId || 0,
        network
    );

    const methods = useForm<AddSubscriptionsForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: AddSubscriptionsForm): void => {
            if (!selectedWebhookId) return;
            addSubscriptions(form.accounts, {
                onSuccess: () => {
                    props.onClose();
                }
            });
        },
        [addSubscriptions, props, selectedWebhookId]
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
                        <SubscriptionsForm id={formId} network={network} onSubmit={onSubmit} />
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
                        isLoading={isPending}
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

export default AddSubscriptionsModal;
