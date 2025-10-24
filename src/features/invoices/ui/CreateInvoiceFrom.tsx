import { FC, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    Input,
    InputGroup,
    InputRightElement,
    Select,
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
    tonMask,
    DTOCryptoCurrency,
    CRYPTO_CURRENCY,
    TokenCurrencyAmount
} from 'src/shared';
import { useIMask } from 'react-imask';
import { observer } from 'mobx-react-lite';
import { CRYPTO_CURRENCY_DECIMALS } from 'src/shared/lib/currency/CRYPTO_CURRENCY';

interface InternalForm {
    amount: string;

    lifeTimeMinutes: number;

    description: string;

    currency: CRYPTO_CURRENCY;
}

const invoiceLifeTimeMask = {
    ...numberMask,
    max: 60 * 24 * 90 // 3 months
};

export const CreateInvoiceFrom: FC<
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
        scale: 3,
        min: 0,
        max: 100000
    });

    const { ref: hookAmountFormRef, ...amountRest } = register('amount', {
        required: 'This is required',
        validate(value) {
            if (!isNumber(value)) {
                return 'Amount should be valid number';
            }

            if (Number(value) < 0.001) {
                return 'Amount must be grater or equal to 0.001';
            }
        }
    });

    const submitMiddleware = (form: InternalForm): void => {
        const { amount, currency, ...values } = form;

        onSubmit({
            amount: TokenCurrencyAmount.fromDecimals(
                amount,
                currency,
                CRYPTO_CURRENCY_DECIMALS[currency]
            ),
            lifeTimeSeconds: Math.floor(values.lifeTimeMinutes * 60),
            currency,
            ...values
        });
    };

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(submitMiddleware)} noValidate {...rest}>
            <FormControl mb="8" isInvalid={!!formState.errors.amount} isRequired>
                <FormLabel htmlFor="amount">Amount</FormLabel>
                <InputGroup>
                    <Input
                        ref={mergeRefs(maskRef, hookAmountFormRef)}
                        pr="60px"
                        autoComplete="off"
                        id="name"
                        placeholder="10"
                        {...amountRest}
                    />
                    <InputRightElement textStyle="body2" w="95px" color="text.secondary">
                        <Select textAlign="end" variant="filled" {...register('currency')}>
                            {Object.entries(DTOCryptoCurrency).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Select>
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

                            if (v > invoiceLifeTimeMask.max) {
                                return `Value must be less or equal to ${invoiceLifeTimeMask.max}`;
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
                            mask={invoiceLifeTimeMask}
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
