import { FC } from 'react';
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

interface DecimalControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const DecimalControl: FC<DecimalControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    const { ref: maskDecimalsRef } = useIMask({
        mask: Number,
        scale: 0,
        min: 0,
        max: 255
    });

    const { ref: hookDecimalsRef, ...registerDecimalsRest } = register('decimals', {
        required: 'This is required'
    });

    return (
        <FormControl mb={0} isInvalid={!!errors.decimals} isRequired>
            <FormLabel htmlFor="decimals">Decimal precision</FormLabel>
            <Input
                ref={mergeRefs(maskDecimalsRef, hookDecimalsRef)}
                autoComplete="off"
                defaultValue="9"
                id="decimals"
                placeholder="9"
                {...registerDecimalsRest}
            />

            <FormHelperText color="text.secondary">
                The decimal precision of your token (9 is TON default).
            </FormHelperText>
            <FormErrorMessage pos="static">
                {errors.decimals && errors.decimals.message}
            </FormErrorMessage>
        </FormControl>
    );
};

export default DecimalControl;
