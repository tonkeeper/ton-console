import { FunctionComponent, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps,
    Text
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
    numberMask,
    TonCurrencyAmount,
    tonMask
} from 'src/shared';
import { useIMask } from 'react-imask';
import { observer } from 'mobx-react-lite';

interface InternalForm {
    amount: string;

    lifeTimeMinutes: number;

    description: string;
}

export const CreateInvoiceFrom: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<InvoiceForm>;
        defaultValues?: Partial<InvoiceForm>;
        disableDefaultFocus?: boolean;
    }
> = observer(({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const { amount: defaultAmount, ...restDefaultValues } = defaultValues || {};
    const context = useFormContext<InternalForm>();
    let { handleSubmit, register, formState, setFocus } = useForm<InternalForm>({
        defaultValues: {
            amount: defaultAmount?.stringAmount,
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
        min: 0,
        max: 100000
    });

    const { ref: hookFormRef, ...amountRest } = register('amount', {
        required: 'This is required',
        validate(value) {
            if (!isNumber(value)) {
                return 'Amount should be valid number';
            }

            if (Number(value) < 0.000000001) {
                return 'Amount must be grater then 0';
            }
        }
    });

    const submitMiddleware = (form: InternalForm): void => {
        const { amount, ...values } = form;
        onSubmit({
            amount: TonCurrencyAmount.fromRelativeAmount(amount),
            lifeTimeSeconds: Math.floor(values.lifeTimeMinutes * 60),
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

            <FormControl mb="4" isInvalid={!!formState.errors.lifeTimeMinutes} isRequired>
                <FormLabel htmlFor="lifeTimeMinutes">Duration</FormLabel>
                <OptionsInput
                    {...register('lifeTimeMinutes', {
                        required: 'This is required',
                        validate: v => {
                            if (v <= 0) {
                                return 'Value must be grater than 0';
                            }
                        }
                    })}
                    defaultValue="1440"
                >
                    <Grid gap="2" gridTemplate="repeat(2, 1fr) / repeat(3, 1fr)">
                        <OptionsInputOption value="60">Hour</OptionsInputOption>
                        <OptionsInputOption value="360">6 hours</OptionsInputOption>
                        <OptionsInputOption value="1440">Day</OptionsInputOption>
                        <OptionsInputOption value="10080">Week</OptionsInputOption>
                        <OptionsInputOption value="43200">Month</OptionsInputOption>
                        <OptionsInputText
                            placeholder="Minutes"
                            mask={numberMask}
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
                <FormLabel htmlFor="description">
                    Description <Span color="text.tertiary">(Optional)</Span>
                </FormLabel>
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
                    Only the administrator can see this description.
                </Text>
            </FormControl>
        </chakra.form>
    );
});
