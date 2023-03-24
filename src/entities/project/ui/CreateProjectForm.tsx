import { FunctionComponent } from 'react';
import { chakra, FormControl, FormLabel, Input, StyleProps } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ImageInput } from 'src/shared';
import { CreateProjectFormValues } from '../model/interfaces';

type CreateProjectFormValuesInternal = Omit<CreateProjectFormValues, 'icon'> & { icon: FileList };

export const CreateProjectForm: FunctionComponent<
    StyleProps & { id?: string; onSubmit: SubmitHandler<CreateProjectFormValues> }
> = props => {
    const { onSubmit, ...rest } = props;
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<CreateProjectFormValuesInternal>();

    const submitMiddleware = (values: CreateProjectFormValuesInternal): void => {
        onSubmit({ name: values.name, icon: values.icon.length ? values.icon[0] : undefined });
    };

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(submitMiddleware)} noValidate {...rest}>
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
            </FormControl>

            <FormControl mb="0">
                <FormLabel htmlFor="icon">Icon</FormLabel>
                <ImageInput {...register('icon')} />
            </FormControl>
        </chakra.form>
    );
};
