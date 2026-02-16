import { FC, useEffect } from 'react';
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

export const WebhookForm: FC<
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
            <FormControl isInvalid={!!errors.endpoint} isRequired>
                <FormLabel htmlFor="name">Webhook URL</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Your webhook URL"
                    {...register('endpoint', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' }
                    })}
                />
                <FormErrorMessage>{errors.endpoint && errors.endpoint.message}</FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
