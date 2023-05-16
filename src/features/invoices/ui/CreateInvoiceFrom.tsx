import { FunctionComponent, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { InvoiceForm } from '../models';
import { isNumber, mergeRefs, TonCurrencyAmount, tonMask } from 'src/shared';
import { useIMask } from 'react-imask';

interface InternalForm {
    amount: string;

    subtractFeeFromAmount: boolean;

    lifeTimeSeconds: number;

    description: number;

    receiverAddress: string;
}

export const CreateInvoiceFrom: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<InvoiceForm>;
        defaultValues?: Partial<InvoiceForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const { amount: defaultAmount, ...restDefaultValues } = defaultValues || {};
    const context = useFormContext<InternalForm>();
    let { handleSubmit, register, formState, setFocus } = useForm<InternalForm>({
        defaultValues: {
            amount: defaultAmount?.toStringAmount(),
            ...restDefaultValues
        }
    });

    if (context) {
        ({ handleSubmit, register, formState, setFocus } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('amount');
        }
    }, [disableDefaultFocus, setFocus]);

    const { ref: maskRef } = useIMask({
        ...tonMask,
        max: 100000
    });

    const { ref: hookFormRef, ...amountRest } = register('amount', {
        required: 'This is required',
        validate(value) {
            if (!isNumber(value)) {
                return 'Amount should be valid number';
            }

            if (Number(value) < 1) {
                return 'Amount must be grater then 1 TON';
            }
        }
    });

    const submitMiddleware = (form: InternalForm): void => {
        const { amount, ...values } = form;
        onSubmit({
            amount: TonCurrencyAmount.fromRelativeAmount(amount),
            ...values
        });
    };

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(submitMiddleware)} noValidate {...rest}>
            <FormControl mb="8" isInvalid={!!formState.errors.amount} isRequired>
                <FormLabel htmlFor="amount">Amount</FormLabel>
                <InputGroup>
                    <Input
                        ref={mergeRefs(maskRef, hookFormRef)}
                        pr="60px"
                        autoComplete="off"
                        id="name"
                        placeholder="10"
                        {...amountRest}
                    />
                    <InputRightElement textStyle="body2" w="60px" color="text.secondary">
                        TON
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                    {formState.errors.amount && formState.errors.amount.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
