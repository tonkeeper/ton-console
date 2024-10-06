import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'symbol';

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
            <FormLabel htmlFor={fieldName}>Symbol</FormLabel>
            <Input
                autoComplete="off"
                id={fieldName}
                placeholder="SMBL"
                {...register(fieldName, {
                    required: 'This is required'
                })}
            />

            <FormHelperText color="text.secondary">
                Currency symbol appearing in balance (usually 3-5 uppercase chars).
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
