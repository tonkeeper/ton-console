import { FunctionComponent, useEffect } from 'react';
import {
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
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { InvoiceForm } from '../models';
import {
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
                <Checkbox
                    mb="3"
                    defaultChecked
                    icon={<TickIcon w="12px" />}
                    id="subtractFeeFromAmount"
                    {...register('subtractFeeFromAmount')}
                >
                    Substract fee from amount
                </Checkbox>
                <Flex textStyle="body2" justify="space-between" mb="1">
                    <Span color="text.secondary">How much money a business will get</Span>
                    <Span color="text.primary">8 TON</Span>
                </Flex>
                <Flex textStyle="body2" justify="space-between">
                    <Span color="text.secondary">Amount the buyer will see</Span>
                    <Span color="text.primary">8 TON</Span>
                </Flex>
            </FormControl>

            <FormControl mb="5" isInvalid={!!formState.errors.lifeTimeMinutes} isRequired>
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
                            pr="60px"
                            placeholder="Few minutes"
                            rightElement={
                                <InputRightElement
                                    textStyle="body2"
                                    w="60px"
                                    color="text.secondary"
                                >
                                    min
                                </InputRightElement>
                            }
                        />
                    </Grid>
                </OptionsInput>
                <FormErrorMessage>
                    {formState.errors.lifeTimeMinutes && formState.errors.lifeTimeMinutes.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
