import { FunctionComponent, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { CreateWebhookForm } from '../model';

export type WebhookFormInternal = {
    endpoint: string;
    initiations: 'transaction' | 'finalizeTrace';
    // accounts: Address[];
    // accounts: string;
};

export const WebhookForm: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<CreateWebhookForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ id, onSubmit, disableDefaultFocus, ...rest }) => {
    const submitHandler = (form: WebhookFormInternal): void => {
        onSubmit({ endpoint: form.endpoint });
    };

    const {
        handleSubmit,
        register,
        setFocus,
        formState: { errors }
    } = useFormContext<WebhookFormInternal>();

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('endpoint');
        }
    }, [disableDefaultFocus, setFocus]);

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl mb="30px" isInvalid={!!errors.endpoint} isRequired>
                <FormLabel htmlFor="name">URL</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Name"
                    {...register('endpoint', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' },
                        maxLength: { value: 64, message: 'Maximum length is 64' }
                    })}
                />
                <FormErrorMessage>{errors.endpoint && errors.endpoint.message}</FormErrorMessage>
            </FormControl>
            {/* <FormControl isInvalid={!!errors.initiations}>
                <FormLabel htmlFor="initiations">Initiations</FormLabel>
                <Controller
                    name="initiations"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup display="flex" flexDirection="column" {...toBinaryRadio(field)}>
                            <Radio
                                alignItems="flex-start"
                                mb="2"
                                isDisabled
                                variant="withDescription"
                            >
                                <Box textStyle="label2" mb="0.5">
                                    Finalized trace
                                </Box>
                            </Radio>
                            <Radio alignItems="flex-start" variant="withDescription" defaultChecked>
                                <Box textStyle="label2" mb="0.5">
                                    Transactions
                                </Box>
                            </Radio>
                        </RadioGroup>
                    )}
                />
            </FormControl>
            <FormControl isInvalid={!!errors.accounts} isRequired>
                <FormLabel htmlFor="accounts">Accounts</FormLabel>
                <Input
                    id="accounts"
                    placeholder="Accounts"
                    {...register('accounts', {
                        required: 'This is required'
                    })}
                />
            </FormControl> */}
        </chakra.form>
    );
};
