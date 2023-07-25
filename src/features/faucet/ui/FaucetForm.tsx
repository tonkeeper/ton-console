import { FunctionComponent, useEffect } from 'react';
import {
    chakra,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Skeleton,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { isNumber, isAddersValid, TonCurrencyAmount, mergeRefs, tonMask, Span } from 'src/shared';
import { useIMask } from 'react-imask';
import { RequestFaucetForm } from '../model';
import { Address } from 'ton-core';

export type FaucetFormInternal = {
    tonAmount: string;
    address: string;
};

export const FaucetForm: FunctionComponent<
    StyleProps & {
        id?: string;
        tonLimit?: TonCurrencyAmount;
        onSubmit: SubmitHandler<RequestFaucetForm>;
        disableDefaultFocus?: boolean;
        isDisabled?: boolean;
    }
> = ({ id, onSubmit, disableDefaultFocus, tonLimit, isDisabled, ...rest }) => {
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
            tonAmount: undefined
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

    const { ref: maskRef } = useIMask({
        ...tonMask,
        min: 0,
        max: tonLimit?.amount.toNumber()
    });

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('tonAmount');
        }
    }, [disableDefaultFocus, setFocus]);

    const { ref: hookFormRef, ...registerAmountRest } = register('tonAmount', {
        required: 'This is required',
        validate: value => {
            if (!isNumber(value)) {
                return 'Wrong amount format';
            }

            if (Number(value) < 0.01) {
                return 'Amount must be greater than 0.01';
            }

            if (!tonLimit) {
                return 'Wait until total supply will be loaded';
            }

            if (tonLimit.amount.lt(value)) {
                return `Not enough testnet coins supply. Max is ${tonLimit.amount.toNumber()}`;
            }
        }
    });

    return (
        <chakra.form id={id} onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <fieldset disabled={isDisabled}>
                <FormControl mb="4" isInvalid={!!errors.tonAmount} isRequired>
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
                        <InputRightElement w="130px">
                            <Span textStyle="body2" color="text.secondary">
                                TON (testnet)
                            </Span>
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage pos="static">
                        {errors.tonAmount && errors.tonAmount.message}
                    </FormErrorMessage>
                    <Flex textStyle="body3" gap="1" mt={errors.tonAmount?.message ? '1' : '2'}>
                        <Span color="text.secondary">Max.available for buy:</Span>
                        <Skeleton minW="80px" h="18px" isLoaded={!!tonLimit}>
                            {tonLimit?.stringCurrencyAmount}&nbsp;(testnet)
                        </Skeleton>
                    </Flex>
                </FormControl>
                <FormControl mb="0" isInvalid={!!errors.address} isRequired>
                    <FormLabel htmlFor="address">Recipient testnet address</FormLabel>
                    <Input
                        autoComplete="off"
                        id="address"
                        placeholder="Address"
                        {...register('address', {
                            required: 'This is required',
                            validate: value => {
                                if (
                                    !isAddersValid(value, { acceptTestnet: true, acceptRaw: true })
                                ) {
                                    return 'Wrong address';
                                }
                            }
                        })}
                    />
                    <FormErrorMessage pos="static">
                        {errors.address && errors.address.message}
                    </FormErrorMessage>
                </FormControl>
            </fieldset>
        </chakra.form>
    );
};
