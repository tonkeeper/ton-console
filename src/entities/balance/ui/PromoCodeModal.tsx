import { FunctionComponent, useEffect, useId } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    chakra,
    FormControl,
    Input,
    FormErrorMessage
} from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { useForm } from 'react-hook-form';
import { balanceStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const PromoCodeModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const {
        handleSubmit,
        register,
        formState: { errors, isDirty },
        setError,
        reset
    } = useForm<{ promoCode: string }>();

    const formId = useId();

    const onSubmit = async (form: { promoCode: string }): Promise<void> => {
        const result = await balanceStore.applyPromoCode(form.promoCode);
        if (result) {
            onClose();
        } else {
            setError(
                'promoCode',
                {
                    message: 'Invalid promo code'
                },
                { shouldFocus: true }
            );
        }
    };

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Refill with Promo Code</H4>
                </ModalHeader>
                <ModalBody overflow="hidden">
                    <chakra.form id={formId} noValidate onSubmit={handleSubmit(onSubmit)}>
                        <FormControl mb="0" isInvalid={!!errors.promoCode}>
                            <Input
                                isDisabled={balanceStore.applyPromoCode.isLoading}
                                placeholder="Promo Code"
                                {...register('promoCode', { required: 'This is required' })}
                            />
                            <FormErrorMessage>
                                {errors.promoCode && errors.promoCode.message}
                            </FormErrorMessage>
                        </FormControl>
                    </chakra.form>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={balanceStore.applyPromoCode.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Apply
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(PromoCodeModal);
