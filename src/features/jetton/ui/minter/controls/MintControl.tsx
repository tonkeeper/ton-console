import { FC } from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { RawJettonMetadata } from '../JettonForm';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

interface MintControlProps {
    context: UseFormReturn<RawJettonMetadata>;
}

const MintControl: FC<MintControlProps> = ({
    context: {
        register,
        formState: { errors }
    }
}) => {
    const { ref: maskMintRef } = useIMask({
        mask: /^(0|[1-9]\d*)$/
    });

    const { ref: hookMintRef, ...registerMintRest } = register('mint', {
        required: 'This is required',
        validate: value => Number(value) > 0 || 'Should be greater than 0'
    });

    return (
        <FormControl mb={0} isInvalid={!!errors.mint} isRequired>
            <FormLabel htmlFor="mint">Tokens to Mint</FormLabel>
            <Input
                ref={mergeRefs(maskMintRef, hookMintRef)}
                autoComplete="off"
                id="mint"
                placeholder="238"
                {...registerMintRest}
            />

            <FormErrorMessage pos="static">{errors.mint && errors.mint.message}</FormErrorMessage>
        </FormControl>
    );
};

export default MintControl;
