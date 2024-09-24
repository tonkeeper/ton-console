import { FC } from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';

interface LogoControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const LogoControl: FC<LogoControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    return (
        <FormControl mb={0} isInvalid={!!errors.image}>
            <FormLabel htmlFor="image">Jetton Logo</FormLabel>
            <Input autoComplete="off" id="image" {...register('image')} />

            <FormHelperText>
                URL of 256x256 pixel PNG image of token logo with transparent background.
            </FormHelperText>
            <FormErrorMessage pos="static">{errors.image && errors.image.message}</FormErrorMessage>
        </FormControl>
    );
};

export default LogoControl;
