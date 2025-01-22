import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

const controlId = 'fee';

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

    const { ref: maskFeeRef } = useIMask({
        mask: Number,
        scale: 2,
        min: 0.15,
        max: 100,
        radix: '.'
    });

    const { ref: hookDecimalsRef, ...registerFeeRest } = register(fieldName, {
        required: 'This is required'
    });

    return (
        <FormControl mb={0} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldName}>Claim Fee</FormLabel>
            <Input
                ref={mergeRefs(maskFeeRef, hookDecimalsRef)}
                autoComplete="off"
                defaultValue="0.15"
                id={fieldName}
                placeholder="0.15 TON"
                {...registerFeeRest}
            />

            <FormHelperText color="text.secondary">
                The amount of TON the recipient must send to receive the Jettons. Min: 0.15 TON.
                After the user pays this amount, the blockchain network fee is deducted from it, and
                the remaining part is divided between the project administrator and the royalty
                recipient (TonApps).
            </FormHelperText>
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
