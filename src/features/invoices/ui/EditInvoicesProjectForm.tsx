import { FunctionComponent, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    StyleProps,
    Text,
    Textarea
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { InvoicesProjectForm } from '../models';
import { isAddersValid } from 'src/shared';

export const EditInvoicesProjectForm: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<InvoicesProjectForm>;
        defaultValues?: Partial<InvoicesProjectForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const context = useFormContext<InvoicesProjectForm>();
    let { handleSubmit, register, formState, setFocus } = useForm<InvoicesProjectForm>({
        defaultValues
    });

    if (context) {
        ({ handleSubmit, register, formState, setFocus } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('name');
        }
    }, [disableDefaultFocus, setFocus]);

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(onSubmit)} noValidate {...rest}>
            <FormControl mb="8" isInvalid={!!formState.errors.name} isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Public project name"
                    {...register('name', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' },
                        maxLength: { value: 64, message: 'Maximum length is 64' }
                    })}
                />
                <FormErrorMessage>
                    {formState.errors.name && formState.errors.name.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mb="8" isInvalid={!!formState.errors.receiverAddress} isRequired>
                <FormLabel htmlFor="receiverAddress">Address</FormLabel>
                <Textarea
                    minH="calc(3em + 16px)"
                    mb="2"
                    resize="none"
                    autoComplete="off"
                    id="receiverAddress"
                    placeholder="EQ..."
                    spellCheck="false"
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
                <Text textStyle="body3" color="text.secondary">
                    Address, which will receive funds for the created invoices
                </Text>
                <FormErrorMessage>
                    {formState.errors.receiverAddress && formState.errors.receiverAddress.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
