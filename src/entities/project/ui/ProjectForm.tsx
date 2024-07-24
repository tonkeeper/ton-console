import { FC, useCallback, useEffect, useState } from 'react';
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
import { ProjectFormValues } from '../model/interfaces';
import { EditProjectParticipan } from './EditProjectParticipan';
import AddProjectParticipantModal from './AddProjectParticipantModal';

type ProjectFormValuesInternal = Omit<ProjectFormValues, 'icon'> & {
    icon: FileList;
};

export const ProjectForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<ProjectFormValues>;
        defaultValues?: Partial<Omit<ProjectFormValues, 'icon'> & { imgUrl: string }>;
        disableDefaultFocus?: boolean;
    }
> = ({ onSubmit, defaultValues, disableDefaultFocus, ...rest }) => {
    const context = useFormContext<ProjectFormValuesInternal>();
    const [isParticipanModalOpen, setIsParticipanModalOpen] = useState(false);

    let { handleSubmit, register, formState, reset, setFocus } =
        useForm<ProjectFormValuesInternal>();
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

    const submitMiddleware = (values: ProjectFormValuesInternal): void => {
        onSubmit({ name: values.name, icon: values.icon?.length ? values.icon[0] : undefined });
    };

    return (
        <>
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

                {defaultValues && ( // if project exists
                    <>
                        <FormLabel fontSize={14} fontWeight={600}>
                            Access to the project
                        </FormLabel>
                        <EditProjectParticipan
                            onAddParticipan={() => setIsParticipanModalOpen(true)}
                        />
                    </>
                )}

                <FormControl mb="0">
                    <FormLabel htmlFor="icon">Icon</FormLabel>
                    <ImageInput {...register('icon')} />
                </FormControl>
            </chakra.form>
            <AddProjectParticipantModal
                isOpen={isParticipanModalOpen}
                onClose={() => setIsParticipanModalOpen(false)}
            />
        </>
    );
};
