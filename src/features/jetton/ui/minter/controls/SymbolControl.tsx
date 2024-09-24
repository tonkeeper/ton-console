import { FC } from 'react';
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';

interface SymbolControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const SymbolControl: FC<SymbolControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    return (
        <FormControl mb={0} isInvalid={!!errors.symbol} isRequired>
            <FormLabel htmlFor="symbol">Symbol</FormLabel>
            <Input
                autoComplete="off"
                id="symbol"
                placeholder="SMBL"
                {...register('symbol', {
                    required: 'This is required'
                })}
            />

            <FormHelperText color="text.secondary">
                Currency symbol appearing in balance (usually 3-5 uppercase chars).
            </FormHelperText>
            <FormErrorMessage pos="static">
                {errors.symbol && errors.symbol.message}
            </FormErrorMessage>
        </FormControl>
    );
};

export default SymbolControl;
