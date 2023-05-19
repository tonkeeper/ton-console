import { FunctionComponent, useEffect } from 'react';
import {
    Button,
    chakra,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps,
    Text,
    Textarea
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { InvoiceForm } from '../models';
import {
    InfoTooltip,
    isAddersValid,
    isNumber,
    mergeRefs,
    OptionsInput,
    OptionsInputOption,
    OptionsInputText,
    Span,
    TickIcon,
    TonCurrencyAmount,
    tonMask
} from 'src/shared';
import { useIMask } from 'react-imask';

interface InternalForm {
    amount: string;

    subtractFeeFromAmount: boolean;

    lifeTimeMinutes: number;

    description: string;

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
    let { handleSubmit, register, formState, setFocus, watch, setValue, trigger } =
        useForm<InternalForm>({
            defaultValues: {
                amount: defaultAmount?.toStringAmount(),
                ...restDefaultValues
            }
        });

    if (context) {
        ({ handleSubmit, register, formState, setFocus, watch, setValue, trigger } = context);
    }

    const addressChanged = watch('receiverAddress') !== restDefaultValues.receiverAddress;

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
            lifeTimeSeconds: values.lifeTimeMinutes * 60,
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

            <FormControl mb="5">
                <Flex align="center" gap="1" mb="3">
                    <Checkbox
                        defaultChecked
                        icon={<TickIcon w="12px" />}
                        id="subtractFeeFromAmount"
                        {...register('subtractFeeFromAmount')}
                    >
                        Subtract fee from amount
                    </Checkbox>
                    <InfoTooltip>Описание что это зачем это и тд</InfoTooltip>
                </Flex>
                <Flex textStyle="body2" justify="space-between" mb="1">
                    <Span color="text.secondary">How much money a business will get</Span>
                    <Span color="text.primary">8 TON</Span>
                </Flex>
                <Flex textStyle="body2" justify="space-between">
                    <Span color="text.secondary">Amount the buyer will see</Span>
                    <Span color="text.primary">8 TON</Span>
                </Flex>
            </FormControl>

            <FormControl mb="4" isInvalid={!!formState.errors.lifeTimeMinutes} isRequired>
                <FormLabel htmlFor="lifeTimeMinutes">Life time</FormLabel>
                <OptionsInput
                    {...register('lifeTimeMinutes', { required: 'This is required' })}
                    defaultValue="1440"
                >
                    <Grid gap="2" gridTemplate="repeat(2, 1fr) / repeat(3, 1fr)">
                        <OptionsInputOption value="60">Hour</OptionsInputOption>
                        <OptionsInputOption value="360">6 Hours</OptionsInputOption>
                        <OptionsInputOption value="1440">Day</OptionsInputOption>
                        <OptionsInputOption value="10080">Week</OptionsInputOption>
                        <OptionsInputOption value="43200">Month</OptionsInputOption>
                        <OptionsInputText
                            placeholder="Few min"
                            rightElement={
                                <Span textStyle="body2" color="text.secondary">
                                    min
                                </Span>
                            }
                        />
                    </Grid>
                </OptionsInput>
                <FormErrorMessage>
                    {formState.errors.lifeTimeMinutes && formState.errors.lifeTimeMinutes.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mb="4" isInvalid={!!formState.errors.description}>
                <FormLabel htmlFor="description">Invoice description</FormLabel>
                <Input
                    autoComplete="off"
                    id="description"
                    placeholder="Few words about the invoice"
                    {...register('description', {
                        maxLength: { value: 255, message: 'Max length is 255 characters' }
                    })}
                />
                <FormErrorMessage pos="static">
                    {formState.errors.description && formState.errors.description.message}
                </FormErrorMessage>
                <Text
                    textStyle="body3"
                    mt={!!formState.errors.description ? '0' : '2'}
                    color="text.secondary"
                >
                    This description will be seen by the recipient
                </Text>
            </FormControl>

            <FormControl mb="1" isInvalid={!!formState.errors.receiverAddress} isRequired>
                <Flex align="flex-end" mb="2">
                    <FormLabel flex="1" mb="0" htmlFor="receiverAddress">
                        <Span textStyle="label2">Receiver address</Span>
                    </FormLabel>
                    <Span textStyle="body3" color="text.secondary">
                        {addressChanged
                            ? 'The default address has been changed'
                            : 'Default address'}
                    </Span>
                    {addressChanged && (
                        <Button
                            h="fit-content"
                            ml="2"
                            p="0"
                            color="accent.blue"
                            onClick={() => {
                                setValue(
                                    'receiverAddress',
                                    restDefaultValues.receiverAddress || ''
                                );
                                trigger('receiverAddress');
                            }}
                            variant="flat"
                        >
                            <Span textStyle="label3">Cancel</Span>
                        </Button>
                    )}
                </Flex>
                <Textarea
                    minH="calc(3em + 16px)"
                    resize="none"
                    autoComplete="off"
                    id="receiverAddress"
                    placeholder="EQ..."
                    {...register('receiverAddress', {
                        required: 'This is required',
                        validate(value) {
                            if (isAddersValid(value)) {
                                return;
                            }

                            return 'Invalid address';
                        }
                    })}
                />
                <FormErrorMessage>
                    {formState.errors.receiverAddress && formState.errors.receiverAddress.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
