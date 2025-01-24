import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'name';

interface ControlProps<T extends { [controlId]: string }> {
    context: UseFormReturn<T>;
}

const Control = <T extends { [controlId]: string }>({
    context: {
        register,
        formState: { errors }
    }
}: ControlProps<T>) => {
    const fieldName = controlId as Path<T>;
    const fieldErrors = errors[controlId] as FieldError | undefined;

    return (
        <FormControl mb={0} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldName}>Name</FormLabel>
            <Input
                autoComplete="off"
                autoFocus
                id={fieldName}
                placeholder="Sending Name"
                {...register(fieldName, {
                    required: 'This is required'
                })}
            />
            <FormHelperText textStyle="body2" color="text.secondary">
                Only the administrator can see this name.
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
