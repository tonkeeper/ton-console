import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { ImageInput } from 'src/shared';

const controlId = 'image';

interface ControlType {
    [controlId]?: string | FileList;
}

interface ControlProps<T extends ControlType> {
    context: UseFormReturn<T>;
}

const Control = <T extends ControlType>({
    context: {
        register,
        formState: { errors, isSubmitting }
    }
}: ControlProps<T>) => {
    const fieldName = controlId as Path<T>;
    const fieldErrors = errors[controlId] as FieldError | undefined;

    return (
        <FormControl>
            <FormLabel htmlFor={fieldName}>Jetton Logo</FormLabel>
            <ImageInput
                disabled={isSubmitting}
                {...register(fieldName)}
                heading="Provide Logo"
                description="Please provide image 256x256 pixel PNG image of token logo with transparent background"
            />

            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
