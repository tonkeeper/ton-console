import { FunctionComponent, useEffect } from 'react';
import {
    Box,
    chakra,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    StyleProps
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { isNumber, mergeRefs, Span, toBinaryRadio } from 'src/shared';
import { useIMask } from 'react-imask';
import { FormState } from 'react-hook-form/dist/types/form';
import { CreateApiKeyForm } from '../model';

type ApiKeyFormWithLimit = {
    name: string;
    useIPLimit: true;
    ipLimitValue: number;
};

type ApiKeyFormWithoutLimit = {
    name: string;
    useIPLimit: false;
};

export type ApiKeyFormInternal = ApiKeyFormWithLimit | ApiKeyFormWithoutLimit;

export const ApiKeyForm: FunctionComponent<
    StyleProps & {
        id?: string;
        maxLimit: number;
        onSubmit: SubmitHandler<CreateApiKeyForm>;
        defaultValues?: CreateApiKeyForm;
        disableDefaultFocus?: boolean;
    }
> = ({ id, onSubmit, defaultValues, disableDefaultFocus, maxLimit, ...rest }) => {
    const submitHandler = (form: ApiKeyFormInternal): void => {
        onSubmit({ name: form.name, limitRps: form.useIPLimit ? Number(form.ipLimitValue) : null });
    };

    const context = useFormContext<ApiKeyFormInternal>();
    let {
        handleSubmit,
        register,
        unregister,
        setFocus,
        control,
        resetField,
        watch,
        getFieldState,
        formState: { errors }
    } = useForm<ApiKeyFormInternal>({
        defaultValues: toApiKeyFormDefaultValues(defaultValues)
    });

    if (context) {
        ({
            handleSubmit,
            register,
            unregister,
            setFocus,
            control,
            resetField,
            watch,
            getFieldState,
            formState: { errors }
        } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('name');
        }
    }, [disableDefaultFocus, setFocus]);

    const useIPLimit = watch('useIPLimit');
    const { isDirty: useIPLimitDirty } = getFieldState('useIPLimit');

    useEffect(() => {
        if (!useIPLimit) {
            unregister('ipLimitValue');
            resetField('ipLimitValue');
        } else if (useIPLimitDirty) {
            setFocus('ipLimitValue');
        }
    }, [useIPLimit, useIPLimitDirty]);

    const { ref } = useIMask({
        mask: Number,
        scale: 1,
        signed: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: [','],
        min: 0,
        max: maxLimit
    });

    let limitInput;

    if (useIPLimit) {
        const { ref: hookFromRef, ...ipLimitValueRest } = register('ipLimitValue', {
            required: 'This is required',
            validate(value) {
                if (!isNumber(value.toString())) {
                    return 'Limit should be valid number';
                }

                if (value < 0.1) {
                    return 'Limit must be grater then 0.1';
                }
            }
        });

        const ipLimitValueErrors = (errors as FormState<ApiKeyFormWithLimit>['errors'])
            .ipLimitValue;

        limitInput = (
            <FormControl isInvalid={!!ipLimitValueErrors} isRequired>
                <Flex align="center">
                    <FormLabel sx={{ mb: '0 !important' }} mr="1.5" htmlFor="ipLimitValue">
                        <Span textStyle="label2">Request Per Second</Span>
                    </FormLabel>
                    <Box textStyle="body2" mr="4" color="text.secondary">
                        min - 0.1, max - {maxLimit}
                    </Box>
                    <Input
                        ref={mergeRefs(ref, hookFromRef)}
                        w="70px"
                        autoComplete="off"
                        id="ipLimitValue"
                        placeholder="1"
                        {...ipLimitValueRest}
                    />
                </Flex>
                <FormErrorMessage>
                    {ipLimitValueErrors && ipLimitValueErrors.message}
                </FormErrorMessage>
            </FormControl>
        );
    }

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl mb="30px" isInvalid={!!errors.name} isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Name"
                    {...register('name', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' },
                        maxLength: { value: 64, message: 'Maximum length is 64' }
                    })}
                />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.useIPLimit} isRequired>
                <Controller
                    name="useIPLimit"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...toBinaryRadio(field)}>
                            <Radio
                                alignItems="flex-start"
                                mb="6"
                                value="false"
                                variant="withDescription"
                            >
                                <Box textStyle="label2" mb="0.5">
                                    Unlimited:{' '}
                                    <Span color="text.secondary" textStyle="body2">
                                        Suitable for backend and scripts
                                    </Span>
                                </Box>
                                <Box textStyle="body2" color="text.secondary">
                                    This key has no inherent limitations and is determined solely by
                                    your plan. It is recommended to utilize this key exclusively in
                                    back-end services and avoid exposing it in client-side code.
                                </Box>
                            </Radio>
                            <Radio alignItems="flex-start" value="true" variant="withDescription">
                                <Box textStyle="label2" mb="0.5">
                                    Limited by IP:{' '}
                                    <Span color="text.secondary" textStyle="body2">
                                        Suitable for frontend
                                    </Span>
                                </Box>
                                <Box textStyle="body2" color="text.secondary">
                                    This key is subject to additional restrictions based on the
                                    number of requests allowed per device (per IP). These keys can
                                    be safely published or utilized in the client side of your
                                    software.
                                </Box>
                            </Radio>
                        </RadioGroup>
                    )}
                />
            </FormControl>
            {limitInput}
        </chakra.form>
    );
};

export function toApiKeyFormDefaultValues(
    createApiKeyForm?: CreateApiKeyForm
): Partial<ApiKeyFormInternal> {
    return {
        name: createApiKeyForm?.name,
        ...(createApiKeyForm?.limitRps != null
            ? { useIPLimit: true, ipLimitValue: createApiKeyForm.limitRps }
            : { useIPLimit: false })
    };
}
