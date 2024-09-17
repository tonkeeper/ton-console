import { FC } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    StyleProps,
    Textarea
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { mergeRefs } from 'src/shared';
import { useIMask } from 'react-imask';
import { JettonData } from '../../lib/deploy-controller';
import { JettonMetadata } from '@ton-api/client';

export type RawJettonMetadata = Omit<JettonMetadata, 'address'> & { mint: string };

type JettonFormProps = StyleProps & {
    id?: string;
    onSubmit: SubmitHandler<RawJettonMetadata>;
};

const JettonForm: FC<JettonFormProps> = observer(({ id, onSubmit, ...rest }) => {
    const submitHandler = (form: RawJettonMetadata): void => {
        onSubmit(form);
    };

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useFormContext<RawJettonMetadata>();

    const { ref: maskDecimalsRef } = useIMask({
        mask: Number,
        scale: 0,
        signed: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: [','],
        min: 0,
        max: 255
    });

    const { ref: hookDecimalsRef, ...registerDecimalsRest } = register('decimals', {
        required: 'This is required'
    });

    const { ref: maskMintRef } = useIMask({
        mask: Number,
        scale: 0,
        signed: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: [','],
        min: 0
    });

    const { ref: hookMintRef, ...registerMintRest } = register('mint', {
        required: 'This is required'
    });

    return (
        <chakra.form
            id={id}
            w="100%"
            maxW={600}
            onSubmit={handleSubmit(submitHandler)}
            noValidate
            gap={4}
            display="flex"
            flexDirection="column"
            {...rest}
        >
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
                <FormErrorMessage pos="static">
                    {errors.name && errors.name.message}
                </FormErrorMessage>
            </FormControl>
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

            <FormControl mb={0} isInvalid={!!errors.mint} isRequired>
                <FormLabel htmlFor="mint">Tokens to Mint</FormLabel>
                <Input
                    ref={mergeRefs(maskMintRef, hookMintRef)}
                    autoComplete="off"
                    id="mint"
                    placeholder="238"
                    {...registerMintRest}
                />

                <FormErrorMessage pos="static">
                    {errors.mint && errors.mint.message}
                </FormErrorMessage>
            </FormControl>

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

            <FormControl mb={0} isInvalid={!!errors.image}>
                <FormLabel htmlFor="image">Jetton Logo</FormLabel>
                <Input autoComplete="off" id="image" {...register('image')} />

                <FormHelperText>
                    URL of 256x256 pixel PNG image of token logo with transparent background.
                </FormHelperText>
                <FormErrorMessage pos="static">
                    {errors.image && errors.image.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
});

export default JettonForm;

export function toRawJettonMetadataDefaultValues(metadata: JettonData | null): RawJettonMetadata {
    return {
        name: metadata?.minter.metadata.name || '',
        symbol: metadata?.minter.metadata.symbol || '',
        image: metadata?.minter.metadata.image || '',
        decimals: metadata?.minter.metadata.decimals || '9',
        description: metadata?.minter.metadata.description || '',
        mint: '0'
    };
}
