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
import { webhooksStore, CreateWebhookForm } from '../model';
import { WebhookForm } from './WebhooksForm';
import { FormProvider, useForm } from 'react-hook-form';

const CreateWebhookModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-webhook-form';

    const methods = useForm<CreateWebhookForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateWebhookForm): void => {
            webhooksStore.createWebhook(form).then(props.onClose);
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
                <ModalHeader>New Webhook</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <WebhookForm id={formId} onSubmit={onSubmit} />
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
                        isLoading={webhooksStore.createWebhook.isLoading}
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

export default observer(CreateWebhookModal);
