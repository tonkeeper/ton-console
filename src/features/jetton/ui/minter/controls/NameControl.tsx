import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'name';

interface ControlProps<T extends { [controlId]: string }> {
    context: UseFormReturn<T>;
}

const Control = <T extends { [controlId]: string }>({
    context: {
        register,
        formState: { errors, isSubmitting }
    }
}: ControlProps<T>) => {
    const fieldName = controlId as Path<T>;
    const fieldErrors = errors[controlId] as FieldError | undefined;

    return (
        <FormControl mb={0} isDisabled={isSubmitting} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldName}>Name</FormLabel>
            <Input
                autoComplete="off"
                autoFocus
                id={fieldName}
                placeholder="Jetton Name"
                {...register(fieldName, {
                    required: 'This is required'
                })}
            />
            <FormHelperText color="text.secondary">
                Name with spaces (usually 1-3 words)
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
