import { FC } from 'react';
import { FormControl, FormLabel, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';

interface DescriptionControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const DescriptionControl: FC<DescriptionControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    return (
        <FormControl mb={0} isInvalid={!!errors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
                autoComplete="off"
                id="description"
                placeholder="Rodent with absolutely no intentions"
                {...register('description')}
            />

            <FormErrorMessage pos="static">
                {errors.description && errors.description.message}
            </FormErrorMessage>
        </FormControl>
    );
};

export default DescriptionControl;
