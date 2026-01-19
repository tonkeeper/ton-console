import { FC, useCallback, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../model/interfaces';

export const ProjectForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<ProjectFormValues>;
        defaultValues?: Partial<ProjectFormValues>;
        disableDefaultFocus?: boolean;
    }
> = ({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const context = useFormContext<ProjectFormValues>();

    let { handleSubmit, register, formState, reset, setFocus } = useForm<ProjectFormValues>();
    if (context) {
        ({ handleSubmit, register, formState, reset, setFocus } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('name');
        }
    }, [disableDefaultFocus, setFocus]);

    const getDefaultValues = useCallback(() => {
        return {
            name: defaultValues?.name || ''
        };
    }, [defaultValues]);

    useEffect(() => {
        reset(getDefaultValues());
    }, [defaultValues, reset, getDefaultValues]);

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(onSubmit)} noValidate {...rest}>
            <FormControl isInvalid={!!formState.errors.name} isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Project name"
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
        </chakra.form>
    );
};
