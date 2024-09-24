import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

const controlId = 'mint';

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

    const { ref: maskMintRef } = useIMask({
        mask: /^(0|[1-9]\d*)$/
    });

    const { ref: hookMintRef, ...registerMintRest } = register(fieldName, {
        required: 'This is required',
        validate: value => Number(value) > 0 || 'Should be greater than 0'
    });

    return (
        <FormControl mb={0} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldName}>Tokens to Mint</FormLabel>
            <Input
                ref={mergeRefs(maskMintRef, hookMintRef)}
                autoComplete="off"
                id={fieldName}
                placeholder="238"
                {...registerMintRest}
            />

            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
