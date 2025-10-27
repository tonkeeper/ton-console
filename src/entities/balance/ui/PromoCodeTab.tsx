import { FC } from 'react';
import { Input, FormControl, FormErrorMessage, chakra } from '@chakra-ui/react';
import {
    UseFormRegisterReturn,
    FieldErrors
} from 'react-hook-form';

type PromoCodeTabProps = {
    formId: string;
    register: UseFormRegisterReturn;
    errors: FieldErrors<{ promoCode: string }>;
    isPromoLoading: boolean;
};

export const PromoCodeTab: FC<PromoCodeTabProps> = ({
    formId,
    register,
    errors,
    isPromoLoading
}) => {
    return (
        <chakra.form id={formId} noValidate>
            <FormControl mb="2" isInvalid={!!errors.promoCode}>
                <Input
                    isDisabled={isPromoLoading}
                    placeholder="Promo Code"
                    {...register}
                />
                <FormErrorMessage>
                    {errors.promoCode && errors.promoCode.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
