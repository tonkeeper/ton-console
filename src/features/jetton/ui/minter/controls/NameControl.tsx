import { FC } from 'react';
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';

interface NameControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const NameControl: FC<NameControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    return (
        <FormControl mb={0} isInvalid={!!errors.name} isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
                autoComplete="off"
                autoFocus
                id="name"
                placeholder="Jetton Name"
                {...register('name', {
                    required: 'This is required'
                })}
            />
            <FormHelperText color="text.secondary">
                Name with spaces (usually 1-3 words)
            </FormHelperText>
            <FormErrorMessage pos="static">{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
    );
};

export default NameControl;
