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
import { isAddressValid } from 'src/shared';

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
            <FormControl mb="4" isInvalid={!!formState.errors.name} isRequired>
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
                <Text textStyle="body3" color="text.secondary">
                    Only the administrator can see this name.
                </Text>
                <FormErrorMessage>
                    {formState.errors.name && formState.errors.name.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mb="0" isInvalid={!!formState.errors.receiverAddress} isRequired>
                <FormLabel htmlFor="receiverAddress">Address</FormLabel>
                <Textarea
                    minH="calc(3em + 16px)"
                    resize="none"
                    autoComplete="off"
                    id="receiverAddress"
                    placeholder="UQ..."
                    spellCheck="false"
                    {...register('receiverAddress', {
                        required: 'This is required',
                        validate(value) {
                            if (isAddressValid(value)) {
                                return;
                            }

                            return 'Invalid address';
                        }
                    })}
                />
                <Text textStyle="body3" color="text.secondary">
                    This address will be used for receiving funds.
                </Text>
                <FormErrorMessage pos="static">
                    {formState.errors.receiverAddress && formState.errors.receiverAddress.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
