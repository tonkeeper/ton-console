import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'image';

interface ControlType {
    [controlId]?: string;
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
        <FormControl mb={0} isDisabled={isSubmitting} isInvalid={!!fieldErrors}>
            <FormLabel htmlFor={fieldName}>Jetton Logo</FormLabel>
            <Input autoComplete="off" id={fieldName} {...register(fieldName)} />

            <FormHelperText>
                URL of 256x256 pixel PNG image of token logo with transparent background.
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
