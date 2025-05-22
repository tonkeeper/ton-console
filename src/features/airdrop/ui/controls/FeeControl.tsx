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
        radix: '.'
    });

    const { ref: hookDecimalsRef, ...registerFeeRest } = register(fieldName, {
        required: 'This is required',
        validate: value => {
            if (parseFloat(value) < 0.15) {
                return 'Minimum 0.15 TON';
            }
            if (parseFloat(value) > 5) {
                return 'Maximum 5 TON';
            }
        }
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
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
            <FormHelperText textStyle="body2" color="text.secondary">
                Amount of TON required to receive Jettons. Min: 0.15 TON and Max: 5 TON.
            </FormHelperText>
        </FormControl>
    );
};

export default Control;
