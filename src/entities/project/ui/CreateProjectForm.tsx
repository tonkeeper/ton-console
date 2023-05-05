import { FunctionComponent, useCallback, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    StyleProps
} from '@chakra-ui/react';
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
        disableDefaultFocus?: boolean;
    }
> = ({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const context = useFormContext<CreateProjectFormValuesInternal>();
    let { handleSubmit, register, formState, reset, setFocus } =
        useForm<CreateProjectFormValuesInternal>();

    if (context) {
        ({ handleSubmit, register, formState, reset, setFocus } = context);
    }

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('name');
        }
    }, [disableDefaultFocus, setFocus]);

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
                        minLength: { value: 3, message: 'Minimum length should be 3' },
                        maxLength: { value: 64, message: 'Maximum length is 64' }
                    })}
                />
                <FormErrorMessage>
                    {formState.errors.name && formState.errors.name.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl mb="0">
                <FormLabel htmlFor="icon">Icon</FormLabel>
                <ImageInput {...register('icon')} />
            </FormControl>
        </chakra.form>
    );
};
