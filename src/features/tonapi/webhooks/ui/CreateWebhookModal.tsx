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
import { useCreateWebhookMutation, CreateWebhookForm, useWebhooksUI } from '../model';
import { WebhookForm } from './WebhooksForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CreateWebhookModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const navigate = useNavigate();
    const formId = 'create-webhook-form';
    const { network, setSelectedWebhookId } = useWebhooksUI();
    const { mutate: createWebhook, isPending } = useCreateWebhookMutation(network);

    const methods = useForm<CreateWebhookForm>();

    const {
        reset,
        formState: { isDirty }
    } = methods;

    const onSubmit = useCallback(
        (form: CreateWebhookForm): void => {
            createWebhook(form, {
                onSuccess: (data: { webhook_id?: number; id?: number }) => {
                    const webhookId = data.webhook_id || data.id;
                    if (!webhookId) {
                        throw new Error('Webhook was not created');
                    }
                    setSelectedWebhookId(webhookId);
                    navigate(`./view?webhookId=${webhookId}`);
                }
            });
        },
        [createWebhook, navigate, setSelectedWebhookId]
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

export default CreateWebhookModal;
