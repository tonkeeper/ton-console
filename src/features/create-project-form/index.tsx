import { FunctionComponent } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    StyleProps
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ImageInput } from 'src/shared';

export const CreateProjectForm: FunctionComponent<StyleProps> = props => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm();

    const onSubmit = (values: unknown): void => {
        console.debug(values);
    };

    return (
        <chakra.form onSubmit={handleSubmit(onSubmit)} noValidate {...props}>
            <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Project name"
                    {...register('name', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' }
                    })}
                />
                <FormErrorMessage>
                    {!!errors.name && (errors.name.message as string)}
                </FormErrorMessage>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="icon">Icon</FormLabel>
                <ImageInput {...register('icon')} />
            </FormControl>
        </chakra.form>
    );
};
