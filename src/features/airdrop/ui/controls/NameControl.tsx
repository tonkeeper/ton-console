import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'name';

interface ControlProps<T extends { [controlId]: string }> {
    context: UseFormReturn<T>;
}

const Control = <T extends { [controlId]: string }>({
    context: {
        register,
        formState: { errors, isSubmitted }
    }
}: ControlProps<T>) => {
    const fieldName = controlId as Path<T>;
    const fieldErrors = errors[controlId] as FieldError | undefined;

    const showError = isSubmitted && !!fieldErrors;

    return (
        <FormControl mb={0} isInvalid={showError} isRequired>
            <FormLabel htmlFor={fieldName}>Name</FormLabel>
            <Input
                autoComplete="off"
                autoFocus
                id={fieldName}
                placeholder="Airdrop Name"
                {...register(fieldName, {
                    required: 'This is required'
                })}
            />
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
