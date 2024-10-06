import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';

const controlId = 'description';
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
            <FormLabel htmlFor={fieldName}>Description</FormLabel>
            <Textarea
                autoComplete="off"
                id={fieldName}
                placeholder="Rodent with absolutely no intentions"
                {...register(fieldName)}
            />

            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
