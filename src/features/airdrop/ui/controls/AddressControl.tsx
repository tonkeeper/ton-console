import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { FieldError, Path, UseFormReturn } from 'react-hook-form';
import { isAddressValid } from 'src/shared';

const controlId = 'address';

interface ControlProps<T extends { [controlId]: string }> {
    context: UseFormReturn<T>;
}

const Control = <T extends { [controlId]: string }>({
    context: {
        register,
        formState: { errors }
    }
}: ControlProps<T>) => {
    const fieldAddress = controlId as Path<T>;
    const fieldErrors = errors[controlId] as FieldError | undefined;

    return (
        <FormControl mb={0} isInvalid={!!fieldErrors} isRequired>
            <FormLabel htmlFor={fieldAddress}>Jetton address</FormLabel>
            <Input
                autoComplete="off"
                id={fieldAddress}
                placeholder="Address of the distributed token"
                {...register(fieldAddress, {
                    required: 'This is required',
                    validate: value => {
                        if (!isAddressValid(value, { acceptTestnet: true, acceptRaw: true })) {
                            return 'Wrong address';
                        }
                    }
                })}
            />
            <FormErrorMessage pos="static">{fieldErrors && fieldErrors.message}</FormErrorMessage>
        </FormControl>
    );
};

export default Control;
