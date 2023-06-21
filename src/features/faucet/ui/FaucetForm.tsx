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
import { isNumber, isAddersValid, TonCurrencyAmount, mergeRefs, tonMask } from 'src/shared';
import { useIMask } from 'react-imask';
import { RequestFaucetForm } from '../model';
import { Address } from 'ton-core';

type FaucetFormInternal = {
    tonAmount: string;
    address: string;
};

export const FaucetForm: FunctionComponent<
    StyleProps & {
        id?: string;
        tonLimit?: TonCurrencyAmount;
        tonLimitLoading: boolean;
        onSubmit: SubmitHandler<RequestFaucetForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ id, onSubmit, disableDefaultFocus, tonLimit, ...rest }) => {
    const submitHandler = (form: FaucetFormInternal): void => {
        onSubmit({
            amount: TonCurrencyAmount.fromRelativeAmount(form.tonAmount),
            receiverAddress: Address.parse(form.address).toRawString()
        });
    };

    const context = useFormContext<FaucetFormInternal>();
    let {
        handleSubmit,
        register,
        setFocus,
        formState: { errors }
    } = useForm<FaucetFormInternal>({
        defaultValues: {
            tonAmount: ''
        }
    });

    if (context) {
        ({
            handleSubmit,
            register,
            setFocus,
            formState: { errors }
        } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('tonAmount');
        }
    }, [disableDefaultFocus, setFocus]);

    const { ref: maskRef } = useIMask({
        ...tonMask,
        min: 0,
        max: tonLimit?.amount.toNumber()
    });

    const { ref: hookFormRef, ...registerAmountRest } = register('tonAmount', {
        required: 'This is required',
        validate: value => {
            if (!isNumber(value)) {
                return 'Wrong amount format';
            }

            if (Number(value) <= 0) {
                return 'Amount must be > 0';
            }
        }
    });

    return (
        <chakra.form id={id} onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl mb="30px" isInvalid={!!errors.tonAmount} isRequired>
                <FormLabel htmlFor="tonAmount">Amount</FormLabel>
                <InputGroup>
                    <Input
                        ref={mergeRefs(maskRef, hookFormRef)}
                        pr="130px"
                        autoComplete="off"
                        id="tonAmount"
                        placeholder="1"
                        {...registerAmountRest}
                    />
                    <InputRightElement textStyle="body2" w="130px" color="text.secondary">
                        TON (testnet)
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.tonAmount && errors.tonAmount.message}</FormErrorMessage>
            </FormControl>
            <FormControl mb="30px" isInvalid={!!errors.address} isRequired>
                <FormLabel htmlFor="address">Recipient testnet address</FormLabel>
                <Input
                    autoComplete="off"
                    id="address"
                    placeholder="EQ..."
                    {...register('address', {
                        required: 'This is required',
                        validate: value => {
                            if (!isAddersValid(value)) {
                                return 'Wrong address';
                            }
                        }
                    })}
                />
                <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
