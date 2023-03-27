import { FunctionComponent, useCallback, useEffect } from 'react';
import { chakra, FormControl, FormLabel, Input, StyleProps } from '@chakra-ui/react';
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { ImageInput, imageUrlToFilesList } from 'src/shared';
import { CreateProjectFormValues } from '../model/interfaces';

type CreateProjectFormValuesInternal = Omit<CreateProjectFormValues, 'icon'> & {
    icon: FileList;
};

export const CreateProjectForm: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<CreateProjectFormValues>;
        defaultValues?: Partial<Omit<CreateProjectFormValues, 'icon'> & { imgUrl: string }>;
    }
> = props => {
    const { onSubmit, defaultValues, ...rest } = props;
    const context = useFormContext<CreateProjectFormValuesInternal>();
    let { handleSubmit, register, formState, reset } = useForm<CreateProjectFormValuesInternal>();

    if (context) {
        ({ handleSubmit, register, formState, reset } = context);
    }

    const getDefaultValues = useCallback(async () => {
        let icon: FileList | null = null;
        if (defaultValues?.imgUrl) {
            icon = await imageUrlToFilesList(defaultValues.imgUrl);
        }

        return {
            name: defaultValues?.name || '',
            icon: icon!
        };
    }, [defaultValues]);

    useEffect(() => {
        getDefaultValues().then(reset);
    }, [defaultValues, reset, getDefaultValues]);

    const submitMiddleware = (values: CreateProjectFormValuesInternal): void => {
        onSubmit({ name: values.name, icon: values.icon?.length ? values.icon[0] : undefined });
    };

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(submitMiddleware)} noValidate {...rest}>
            <FormControl isInvalid={!!formState.errors.name} isRequired>
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
