import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

const controlId = 'decimals';

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

    const { ref: maskDecimalsRef } = useIMask({
        mask: Number,
        scale: 0,
        min: 0,
        max: 255
    });

    const { ref: hookDecimalsRef, ...registerDecimalsRest } = register(fieldName, {
        required: 'This is required'
    });

    return (
        <FormControl mb={0} isDisabled={isSubmitting} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldName}>Decimal precision</FormLabel>
            <Input
                ref={mergeRefs(maskDecimalsRef, hookDecimalsRef)}
                autoComplete="off"
                defaultValue="9"
                id={fieldName}
                placeholder="9"
                {...registerDecimalsRest}
            />

            <FormHelperText color="text.secondary">
                The decimal precision of your token (9 is TON default).
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
